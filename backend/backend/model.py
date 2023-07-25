from sqlalchemy import Column, Integer, String,DateTime,ForeignKey,Boolean
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session,sessionmaker,relationship


basedir=os.path.dirname(os.path.realpath(__file__))
conn_url="sqlite:///"+os.path.join(basedir,'users.db')

# engine = create_engine("sqlite+pysqlite:///:memory:", echo=True)
engine = create_engine(conn_url, echo=True)
Base = declarative_base()
session=scoped_session(sessionmaker(bind=engine))

Base.query=session.query_property()

class TodoModel(Base):
    __tablename__ = 'todo'
    id = Column(Integer, primary_key=True)
    title = Column(String,nullable=False)
    desc = Column(String)
    user_id=Column(String,ForeignKey('user.username'),nullable=False)
    create_date=Column(DateTime,nullable=False,default=datetime.utcnow)
    # todos=relationship("User", back_populates = "todo")
    user= relationship("User", back_populates="todos")
    def __repr__(self):
        return f'todo {self.title}{self.id}'
    
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String,nullable=False,unique=True)
    member=Column(Boolean, default=False)
    todos = relationship('TodoModel', back_populates='user')
    
    def __repr__(self):
        return f'user {self.username}'

# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)



