from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AuthorViewSet, BookViewSet, BorrowerViewSet

router = DefaultRouter()
router.register('authors', AuthorViewSet)
router.register('books', BookViewSet)
router.register('borrowers', BorrowerViewSet)

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)), 
]