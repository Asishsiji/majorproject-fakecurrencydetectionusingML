from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

# Create your models here.

class LocationModel(models.Model):
    name=models.CharField(max_length=200)

 
class User(AbstractUser):
    location=models.ForeignKey(LocationModel,on_delete=models.CASCADE,null=True)
    control_room=models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    phone = models.PositiveBigIntegerField(null=True)

 
class CurrencyResultModel(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    image=CloudinaryField('image', folder='Fakecurrency/images',null=True)

    date=models.DateTimeField(auto_now_add=True)


class ChatModel(models.Model):
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('seen', 'Seen'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent', null=True)
    is_read = models.BooleanField(default=False)  

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.message[:30]}"
    

class FeedbackModel(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    feedback=models.TextField()
    rating=models.PositiveIntegerField()
    date=models.DateField(auto_now_add=True)

class OtpModel(models.Model):
    otp=models.PositiveIntegerField()
    user=models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    email = models.EmailField(null=True)





