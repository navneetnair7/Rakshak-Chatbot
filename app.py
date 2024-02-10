from flask import Flask, request
from flask_cors import CORS

app=Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

#Database: POSTGRESql

# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:122chandrama@localhost:5432/flaskcrud"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)
# migrate = Migrate(app, db)

# with app.app_context():
#     db.create_all()


#creating routes
@app.route("/")
def hello():
    return "<h1>Hello World </h1>"

# #user api route for login 
# @app.route("/user", methods=['GET','POST'])
# def user():
    
#     if request.method== 'POST':
#         data=request.json
#         username=data["user"]
#         password=data["password"]
#         print(username,password)
#         new_user = users(username=username, password=password)
#         db.session.add(new_user)
#         db.session.commit()
#         return f"Done!!"
    
#     elif request.method == 'GET':
#         all_users = users.query.all()
#         results = [
#             {
#                 "name": user.username,
#                 "password": user.password,
#             } for user in all_users]

#         return {"count": len(results), "users": results}

# #for update and deletion
# @app.route("/user/<id>", methods=["PUT","DELETE"])
# def user_modify(id):
    
#     user=users.query.get(id)
#     if request.method == 'PUT':
#         new_username = request.json['user']
#         new_password = request.json['password']

#         user.username = new_username
#         user.password = new_password

#         db.session.commit()
#         return "updated"
    
#     elif request.method == 'DELETE':
#         user = users.query.get(id)
#         db.session.delete(user)
#         db.session.commit()
#         return "deleted"
#     return "Got Users"

# #route for doctor
# @app.route("/doctors",methods=["GET","POST"])
# def doctor():
#     if request.method == "GET":
#         all_doctors = doctors.query.all()
#         results = [
#             {
#                 "name": doctor.name,
#                 "status": doctor.status,
#             } for doctor in all_doctors]

#         return results
#     elif request.method == "POST":
#         data=request.json
#         name=data["name"]
#         status=data["status"]
#         print(name,status)
#         new_doctor = doctors(name=name, status=status)
#         db.session.add(new_doctor)
#         db.session.commit()
#         return f"Done!!"
        

# @app.route("/selecteddoctor", methods=["GET", "POST"])
# def selected():
#     if request.method == "POST":
#         data=request.json
#         doctor=data["doctorname"]
#         user=data["username"]
#         #search for doctor id and user id and redirect to meet.py
#         print(doctor)
#         print(user)
#         userid=(users.query.filter_by(username=user).first()).id
#         doctorid=(doctors.query.filter_by(name=doctor).first()).id
#         print(userid)
#         print(doctorid)
#         # start(userid,doctorid)
#         return f"{userid} and {doctorid} are going to join meet"
    
#     elif request.method == "GET":
#         return f"{userid} and {doctorid} are going to join meet"
        
            
    



#listening 
if __name__=="__main__":
    app.run(debug=True, port=8080)
    

