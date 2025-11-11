from django.db import models
from django.contrib.auth import get_user_model 

User = get_user_model()

class Author(models.Model):
    name = models.TextField()
    email = models.EmailField()


class Book(models.Model):
    title = models.TextField()
    author = models.ForeignKey(Author,on_delete=models.CASCADE)
    published_date = models.DateField()
    available_copies = models.IntegerField()
    added_date =models.DateField(auto_now_add=True)

class Borrower(models.Model):
    name = models.TextField()
    email = models.EmailField()
    book = models.ForeignKey(Book,on_delete=models.CASCADE)
    borrowed_date = models.DateField(auto_now_add=True)
    return_date = models.DateField()

