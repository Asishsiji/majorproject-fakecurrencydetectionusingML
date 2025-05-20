from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from .models import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework import authentication,permissions
from django.core.mail import send_mail
import random
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


def emailsend(email,otp):
    try:
                
                data=OtpModel.objects.filter(email=email)
                if data:
                     data.delete()
                OtpModel.objects.create(otp=otp,email=email)
                
                send_mail(
                    subject="Otp Verification",
                    message=f"your one time password is {otp} Don't share with anyone",
                    from_email="softemailsoftemail@gmail.com",
                    recipient_list=[email],
                    fail_silently=True  
                )
    except Exception as e:
                print(f"Email sending failed: {e}")




class LocationView(ModelViewSet):
    # authentication_classes=[authentication.TokenAuthentication]
    # permission_classes=[permissions.IsAdminUser]
    serializer_class=LocationSerializer
    queryset=LocationModel.objects.all()


class UserListView(ModelViewSet):
     serializer_class=UserViewSerializer
     queryset=User.objects.all()



class UserView(ModelViewSet):
    serializer_class=UserSerializer
    queryset=User.objects.all()

    def list(self, request, *args, **kwargs):
         data=self.get_queryset().filter(control_room=False)
         serializer=UserViewSerializer(data,many=True)
         return Response(data=serializer.data)

   

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            email = request.data.get('email')
            otp = request.data.get('otp')
            obj = OtpModel.objects.get(email=email)
            if int(otp) == int(obj.otp):
                 
                serializer.save()
                obj.delete()

            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ResetPassword(APIView):
    def put(self, request):
        email = request.data.get("email")
        otp_value = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not email or not otp_value or not new_password:
            return Response({"error": "Email, OTP, and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_record = OtpModel.objects.get(email=email)
            if str(otp_record.otp) != str(otp_value):
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.get(email=email)
            user.set_password(new_password)  
            user.save()
            otp_record.delete()

            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except OtpModel.DoesNotExist:
            return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
      
        
class Emailsending(APIView):
     def post(self,request):
        random_number = random.randint(1000, 9999) 
        email=request.data.get('email')
        emailsend(email,random_number)
        return Response(data='email send')
     

class FeedbackView(ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FeedbackSerializer
    queryset = FeedbackModel.objects.all()  

    def create(self, request, *args, **kwargs):
        

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) 
            return Response({"message": "Feedback added"}, status=201)

        return Response({"error": serializer.errors}, status=400)
    

class ChatView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, **kw):
        user = request.user
        sender = User.objects.get(id=user.id)
        receiver_id = kw.get("id")
        receiver = User.objects.get(id=receiver_id)
        message_text = request.data.get("message")

        chat = ChatModel.objects.create(sender=sender, receiver=receiver, message=message_text)

        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=201)

    def get(self, request, **kw):
        user = request.user
        receiver_id = kw.get('id')

        if not receiver_id:
            return Response({"error": "Receiver ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

        messages = ChatModel.objects.filter(
            sender__in=[user, receiver], receiver__in=[user, receiver]
        ).order_by("timestamp")

        ChatModel.objects.filter(receiver=user, sender=receiver, is_read=False).update(is_read=True)

        serializer = ChatSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UnreadMessagesView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        unread_counts = ChatModel.objects.filter(receiver=user, is_read=False).values('sender').annotate(unread_count=models.Count('id'))

        return Response(unread_counts, status=status.HTTP_200_OK)
    

class CurrencyResultView(ModelViewSet):
    authentication_classes=[authentication.TokenAuthentication]
    permission_classes=[permissions.IsAuthenticated]

    serializer_class=ResultSerializer
    queryset=CurrencyResultModel.objects.all()

    def create(self, request, *args, **kwargs):
        data =ResultSerializer(data=request.data)
        user=request.user
        if data.is_valid():
            data.save(user=user)
            return Response(data='added',status=status.HTTP_200_OK)
        else:
            return Response(data=data.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def list(self, request, *args, **kwargs):
        user=request.user
        result=self.get_queryset().filter(user=user)
        serializer=self.get_serializer(result,many=True)
        return Response(data=serializer.data)

class UserResultView(APIView):
    def get(self, request, *args, **kwargs):
        id=kwargs.get('id')
        try:
            result=CurrencyResultModel.objects.filter(user_id=id)
            serializer=ResultSerializer(result,many=True)
            return Response(data=serializer.data)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


        

class AdminControlroomReg(ModelViewSet):
    # authentication_classes=[authentication.TokenAuthentication]
    # permission_classes=[permissions.IsAdminUser]
    serializer_class=UserSerializer
    queryset=User.objects.all()

    def create(self,request,**kw):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(control_room=True)
            return Response(data='added',status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    def list(self,request,**kw): 
         data=self.get_queryset().filter(control_room=True)
         serializer=UserViewSerializer(data,many=True)
         return Response(data=serializer.data)
    

    def update(self, request, *args, **kwargs):
        instance=self.get_object()
        serializer=UserSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save() 
            return Response(data=f'updated')
        else:
            return Response(data=serializer.errors)
     

class AdminFeedbackView(ModelViewSet):
   
    serializer_class = FeedbackSerializer
    queryset = FeedbackModel.objects.all()



class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({ "token": token.key,"user": {"id": user.id,"username": user.username,"is_superuser": user.is_superuser,"control_room": user.control_room}})
    
    