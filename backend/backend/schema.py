
from graphene_sqlalchemy import SQLAlchemyObjectType,SQLAlchemyConnectionField
import graphene
from graphene import relay
from backend.model import TodoModel,User


class Todoclass(SQLAlchemyObjectType):
    class Meta:
        model = TodoModel

class Userclass(SQLAlchemyObjectType):
    class Meta:
        model = User      
        

class Query(graphene.ObjectType):
    
    all_todo= graphene.List(Todoclass)
    all_user=graphene.List(Userclass)
    user_todos = graphene.List(Todoclass, id=graphene.String(required=True))
    def resolve_all_todo(self, info):
        query = Todoclass.get_query(info)  
        return query.all() 
    
    def resolve_all_user(self,info):
        query = Userclass.get_query(info)  
        return query.all()
    def resolve_user_todos(self, info, id):
        query = Todoclass.get_query(info)
        return query.filter_by(user_id=id).all()
schema = graphene.Schema(query=Query)
    