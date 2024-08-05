from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import requests


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)

    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None



def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    if expires_in is None:
        raise ValueError("Expires_in cannot be None")

    expires_in = timezone.now() + timedelta(seconds=expires_in)
    tokens = get_user_tokens(session_id)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token or tokens.refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()




def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False




def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    if not access_token or not token_type or expires_in is None:
        raise ValueError("Invalid response from Spotify API")

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in,  refresh_token)



def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return {'Error': 'User not authenticated'}

    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + tokens.access_token
    }

    try:
        if post_:
            post(BASE_URL + endpoint, headers=headers)
        if put_:
            put(BASE_URL + endpoint, headers=headers)
            print(endpoint)

        response = get(BASE_URL + endpoint, {}, headers=headers)

   
        if response.status_code == 204:
            return {'Message': 'No content available'}

    
        try:
            return response.json()
        except ValueError:
            return {'Error': 'Response is not in JSON format'}

    except requests.exceptions.HTTPError as http_err:
        return {'Error': f'HTTP error occurred: {http_err}'}
    except requests.exceptions.RequestException as req_err:
        return {'Error': f'Request error occurred: {req_err}'}
    except Exception as ex:
        return {'Error': f'An unexpected error occurred: {ex}'}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def skip_song(session_id):
    return execute_spotify_api_request(session_id,"player/next",post_=True)


def skip_previous_song(session_id):
    return execute_spotify_api_request(session_id,"player/previous",post_=True)