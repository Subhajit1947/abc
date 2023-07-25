
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_graphql import GraphQLView
from backend.schema import schema
from backend.model import TodoModel,session,User
from keycloak import KeycloakOpenID
import jwt

KEYCLOAK_PUBLIC_KEY="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy8Bs8mBmbheDPfEYvOwjlici75WK4GgE5/AYKWic1KWPI08qfNfh/9LOCFBSXm0q6BP2Wi6eyaZJC0rHkrxd9BxQaFQBvxI81n/3W+eD1dps8N33it/cWYflLcY7i8hWfpu6RBKCWU1IYS9NvMt20QMOfolb6udWuUPullW4jfAgU+cpkysEZ3trrqrzxK0m7hTSTkQbRTwDZFiy4UdwQWiCvhEtjo/uamekXNmRbPXO9Gi79QZkujBvBvZoZyFzJCwhg33F0m95aog6mp5vrLjVnQwyGhNi795MDHFzPvVvIYPUOfVScoxoLy7DmZevTEeybYT4M8RdLrJwIHCk4wIDAQAB"
public_key = """-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy8Bs8mBmbheDPfEYvOwjlici75WK4GgE5/AYKWic1KWPI08qfNfh/9LOCFBSXm0q6BP2Wi6eyaZJC0rHkrxd9BxQaFQBvxI81n/3W+eD1dps8N33it/cWYflLcY7i8hWfpu6RBKCWU1IYS9NvMt20QMOfolb6udWuUPullW4jfAgU+cpkysEZ3trrqrzxK0m7hTSTkQbRTwDZFiy4UdwQWiCvhEtjo/uamekXNmRbPXO9Gi79QZkujBvBvZoZyFzJCwhg33F0m95aog6mp5vrLjVnQwyGhNi795MDHFzPvVvIYPUOfVScoxoLy7DmZevTEeybYT4M8RdLrJwIHCk4wIDAQAB\n-----END PUBLIC KEY-----"""
app = Flask(__name__)
audience='account'
CORS(app)
keycloak_openid = KeycloakOpenID(server_url="http://localhost:8080/",
                                 client_id="flask",
                                 realm_name="flask-app",
                                 client_secret_key="pww8bSrx1sYC1oLsDkWwj7P2SS6BbpiK")


def secure_graphql_route(view_function):
	def decorated_function(*args, **kwargs):  
		if 'Authorization' not in request.headers:
			return jsonify({"message": "Unauthorized"}), 401
		else:
			access_token=request.headers['Authorization'].split()[1]
			token_info = jwt.decode(access_token,public_key, algorithms=["RS256"],audience=audience)
			print('.........\n',token_info['preferred_username'],'\n............')
			uex=session.query(User).filter_by(username=token_info['preferred_username']).all()
			if not uex:
				u=User(username=token_info['preferred_username'])
				session.add(u)
				session.commit()
			print('.........\n',token_info['preferred_username'],'\n............')
			return view_function(*args, **kwargs)
			
	return decorated_function



# def secure_graphql_route(view_function):
    
	
#     def decorated_function(*args, **kwargs):       
# 		if 'Authorization' not in request.headers:
# 			return jsonify({"message": "Unauthorized"}), 401
# 		else:
# 			try:
# 				access_token=request.headers['Authorization'].split()[1]
# 				token_info = keycloak_openid.decode_token(access_token, key='',algorithms=['RS256'])
# 				print(token_info)
# 				return view_function(*args, **kwargs)
# 			except:
# 				return jsonify({"message": "Unauthorized"}), 401 
#     return decorated_function


app.add_url_rule('/graphql', view_func=secure_graphql_route(GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
    
)),methods=['GET','POST'])


	
# app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
#     'graphql',
#     schema=schema,
#     graphiql=True,
    
# ))



@app.route('/create-todo', methods = ['GET', 'POST'])

def create_todo():
	
	if 'Authorization' in request.headers:
		access_token = request.headers['Authorization']
		print('.................................')
		print(access_token)
		print('.................................')
		access_token=request.headers['Authorization'].split()[1]
		token_info = jwt.decode(access_token,public_key, algorithms=["RS256"],audience=audience)
		if request.method == 'POST':
			data1=request.get_json()
			if data1:
				su=session.query(User).filter_by(username=token_info['preferred_username']).all()
				# print('\n',su[0].id,'\n')
				
				new_todo=TodoModel(title=data1['title'],desc=data1['desc'],user_id=su[0].username)
				session.add(new_todo)
				session.commit()
				return jsonify({'res':'successful'})
			return jsonify({'res':'error'})
	else:
		return jsonify({"message": "Unauthorized"}), 401
	

@app.route('/deltodo', methods = ['GET', 'POST'])
	
def deltodo():
	if 'Authorization' in request.headers:
		if request.method == 'POST':
			data2=request.get_json()
			if data2:
				deltodo=session.query(TodoModel).get(data2['id'])
				session.delete(deltodo)
				session.commit()
				return jsonify({'res':'successful'})
			return jsonify({'res':'successful'})
	else:
		return jsonify({"message": "Unauthorized"}), 401

@app.route('/update-todo', methods = ['GET', 'POST'])

def update_todo():
	if 'Authorization' in request.headers:
		if request.method == 'POST':
			data2=request.get_json()
			if data2:
				updatetodo=session.query(TodoModel).get(data2['id'])
				updatetodo.title=data2['title']
				updatetodo.desc=data2['desc']
				session.commit()
				return jsonify({'res':'successful'})
			return jsonify({'res':'successful'})
	else:
		return jsonify({"message": "Unauthorized"}), 401

if __name__ == '__main__':

	app.run(debug = True)
