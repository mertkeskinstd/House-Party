from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', SpotifyCallback.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view(), name='pause_song'),
    path('play', PlaySong.as_view(), name='play_song'),
    path('skip',SkipSong.as_view(),name="skip_song"),
    path('previous',PreviousSong.as_view(),name="previous"),
    
]