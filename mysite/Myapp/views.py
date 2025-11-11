from rest_framework import viewsets
from .models import Author, Book, Borrower
from .serializers import AuthorSerializer, BookSerializer, BorrowerSerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BorrowerViewSet(viewsets.ModelViewSet):
    queryset = Borrower.objects.all()
    serializer_class = BorrowerSerializer