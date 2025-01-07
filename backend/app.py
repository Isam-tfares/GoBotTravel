from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from models import db, User, Conversation, Message
from datetime import datetime
import os
from mistralai import Mistral
from datetime import timedelta

# Initialize Flask application
app = Flask(__name__)
password = ""
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:{password}@localhost/travel_chatbot'
app.config['JWT_SECRET_KEY'] = '8c0c756b1433111ac2e6ec6f78e1ebcb266ada0a5614d998bac72fd112e37bd9'  # Change this in production
jwt = JWTManager(app)
db.init_app(app)

# Set the Mistral API Key
os.environ['MISTRAL_API_KEY'] = "mEip0RAnxIMpQIM0MzPizJoXfgowXntp"
api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

# Function to generate a concise title using the model
def generate_title(question):
    try:
        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "user",
                    "content": f"You are a helpful assistant. Generate a concise and descriptive title for the following question: {question} \n gives just title in your output",
                },
            ]
        )
        return chat_response.choices[0].message.content
    except Exception as e:
        print(f"Error generating title: {e}")
        return "New Conversation"

# Function to generate a response from the model
def generate_response(prompt, context):
    try:
        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that responds to travel-related questions."
                },
                {
                    "role": "user",
                    "content": prompt
                },
                *context  # Include previous conversation context
            ]
        )
        return chat_response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        return "Sorry, I couldn't provide an answer at the moment."

# Authentication APIs
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    expires = timedelta(days=1)
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=str(user.id) , expires_delta=expires)  # Make sure the identity is a string
        return jsonify({'access_token': access_token,'email':data['email'],'username':user.username}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/conversation', methods=['POST'])
@jwt_required()
def handle_conversation():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({'error': 'Invalid JWT token'}), 401

        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        question = data.get('question')
        conversation_id = data.get('conversation_id')

        if not isinstance(question, str) or not question.strip():
            return jsonify({'error': 'Question must be a non-empty string'}), 400

        # If conversation_id is provided, add a new message to the existing conversation
        if conversation_id:
            conversation = Conversation.query.get_or_404(conversation_id)
            if conversation.user_id != int(user_id):
                return jsonify({'error': 'Unauthorized'}), 403

            # Add user's message to the conversation
            user_message = Message(
                conversation_id=conversation_id,
                content=question,
                is_bot=False
            )
            db.session.add(user_message)

            # Add conversation context for bot response
            context = [{'role': 'user', 'content': msg.content} for msg in conversation.messages]

            # Generate bot response
            bot_response = generate_response(question, context)

            # Add bot's message to the conversation
            bot_message = Message(
                conversation_id=conversation_id,
                content=bot_response,
                is_bot=True
            )
            db.session.add(bot_message)
            db.session.commit()

            return jsonify({
                'conversation_id': conversation_id,
                'user_message': user_message.content,
                'bot_response': bot_message.content,
                'title': conversation.title
            }), 200

        # If no conversation_id, create a new conversation
        else:
            # Generate a title from the question
            title = generate_title(question.strip()) if question.strip() else 'New Conversation'

            # Create a new conversation
            conversation = Conversation(user_id=user_id, title=title)
            db.session.add(conversation)
            db.session.commit()

            # Add user's message to the conversation
            user_message = Message(
                conversation_id=conversation.id,
                content=question,
                is_bot=False
            )
            db.session.add(user_message)

            # Generate bot response
            bot_response = generate_response(question, [{'role': 'user', 'content': question}])

            # Add bot's message to the conversation
            bot_message = Message(
                conversation_id=conversation.id,
                content=bot_response,
                is_bot=True
            )
            db.session.add(bot_message)
            db.session.commit()

            return jsonify({
                'conversation_id': conversation.id,
                'user_message': user_message.content,
                'bot_response': bot_message.content,
                'title': title
            }), 201

    except Exception as e:
        print(f"Unhandled Exception: {e}")
        return jsonify({'error': 'An error occurred while processing the conversation'}), 500



@app.route('/api/conversations', methods=['POST'])
@jwt_required()
def get_conversations():
    user_id = get_jwt_identity()
    conversations = Conversation.query.filter_by(user_id=user_id).order_by(Conversation.timestamp.desc()).all()
    
    return jsonify({
        'conversations': [{
            'id': conv.id,
            'title': conv.title,
            'timestamp': conv.timestamp,
            'messages': [{
                'content': msg.content,
                'is_bot': msg.is_bot,
                'timestamp': msg.timestamp
            } for msg in conv.messages]
        } for conv in conversations]
    }), 200


# Get specific conversation
@app.route('/api/conversation/<int:conversation_id>', methods=['POST'])
@jwt_required()
def get_conversation(conversation_id):
    user_id = get_jwt_identity()
    conversation = Conversation.query.get_or_404(conversation_id)
    
    if conversation.user_id != int(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': conversation.id,
        'title': conversation.title,
        'timestamp': conversation.timestamp,
        'messages': [{
            'content': msg.content,
            'is_bot': msg.is_bot,
            'timestamp': msg.timestamp
        } for msg in conversation.messages]
    }), 200

@app.route('/api/conversation/<int:conversation_id>', methods=['DELETE'])
@jwt_required()
def delete_conversation(conversation_id):
    try:
        user_id = get_jwt_identity()
        
        # Get conversation
        conversation = Conversation.query.get_or_404(conversation_id)
        
        # Verify conversation belongs to user
        if conversation.user_id != int(user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete all messages in conversation
        Message.query.filter_by(conversation_id=conversation_id).delete()
        
        # Delete conversation
        db.session.delete(conversation)
        db.session.commit()
        
        return jsonify({'message': 'Conversation deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# @app.route('/api/travelIdeas', methods=['GET'])
# def get_travel_ideas():
#     try:
#         # Define the prompt for Mistral
#         prompt = (
#             "You are a travel expert. Generate 4 unique and engaging travel-related ideas for discussion. ( every dea has max words 15) ( btween ideas make this separtor ) "
#             "The ideas should cover various aspects like destinations, budgeting, packing, or unique experiences."
#         )
        
#         # Call Mistral API to generate travel ideas
#         chat_response = client.chat.complete(
#             model="mistral-large-latest",
#             messages=[
#                 {
#                     "role": "user",
#                     "content": prompt
#                 }
#             ]
#         )
        
#         # Parse response to extract ideas
#         response_content = chat_response.choices[0].message.content.strip()
#         travel_ideas = response_content.split("\n")  # Assume ideas are separated by newlines

#         return jsonify({'ideas': travel_ideas}), 200
#     except Exception as e:
#         print(f"Error fetching travel ideas from Mistral: {e}")
#         return jsonify({'error': 'Unable to fetch travel ideas'}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables if they do not exist
    app.run(host='0.0.0.0', port=5000,debug=True)

