"""
URL configuration for fakecurrency project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from account.views import *
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static
 
router=DefaultRouter()
router.register('location',LocationView,basename='location')
router.register('user',UserView,basename='user')
router.register('feedback',FeedbackView,basename='feedback')
router.register('result',CurrencyResultView,basename='currencyresult')
router.register('control-room/reg',AdminControlroomReg,basename='controlroomreg')
router.register('admin_feedback', AdminFeedbackView, basename='adminfeedback')
router.register('userlist', UserListView, basename='userlist')
 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/<int:id>/',ChatView.as_view(),name='chat'),
    path('token/', CustomAuthToken.as_view(), name='token'), 
    path('email/otp',Emailsending.as_view(),name='otp'),
    path('reset-password',ResetPassword.as_view(),name='reset-password'),
    path('user/result/<int:id>/',UserResultView.as_view(),name='userresult'),
    path('chat/unread/', UnreadMessagesView.as_view(), name='unread_messages'),

]+router.urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)