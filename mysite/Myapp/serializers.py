from rest_framework import serializers
from .models import Author, Book, Borrower 

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'name', 'email') 


class BorrowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrower
        fields = ('id', 'name', 'email', 'book', 'return_date', 'borrowed_date')

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'