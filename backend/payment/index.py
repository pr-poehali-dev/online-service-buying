import json
import os
import base64
import requests
from typing import Any

def handler(event: dict, context: Any) -> dict:
    """API для создания и проверки платежей через ЮKassa"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Payment system not configured'}),
            'isBase64Encoded': False
        }
    
    auth_string = f"{shop_id}:{secret_key}"
    auth_encoded = base64.b64encode(auth_string.encode()).decode()
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        amount = body.get('amount')
        package_name = body.get('package_name')
        customer_email = body.get('customer_email')
        customer_name = body.get('customer_name')
        customer_phone = body.get('customer_phone')
        
        if not amount or not package_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        payment_data = {
            'amount': {
                'value': str(amount),
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': event.get('headers', {}).get('origin', 'https://example.com')
            },
            'capture': True,
            'description': f'Оплата пакета услуг: {package_name}',
            'metadata': {
                'package_name': package_name,
                'customer_name': customer_name,
                'customer_phone': customer_phone
            }
        }
        
        if customer_email:
            payment_data['receipt'] = {
                'customer': {
                    'email': customer_email
                },
                'items': [{
                    'description': f'Пакет услуг: {package_name}',
                    'quantity': '1.00',
                    'amount': {
                        'value': str(amount),
                        'currency': 'RUB'
                    },
                    'vat_code': 1
                }]
            }
        
        try:
            response = requests.post(
                'https://api.yookassa.ru/v3/payments',
                json=payment_data,
                headers={
                    'Authorization': f'Basic {auth_encoded}',
                    'Content-Type': 'application/json',
                    'Idempotence-Key': context.request_id
                },
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                payment_response = response.json()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'payment_id': payment_response.get('id'),
                        'confirmation_url': payment_response.get('confirmation', {}).get('confirmation_url'),
                        'status': payment_response.get('status')
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Payment creation failed', 'details': response.text}),
                    'isBase64Encoded': False
                }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    if method == 'GET':
        payment_id = event.get('queryStringParameters', {}).get('payment_id')
        
        if not payment_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'payment_id required'}),
                'isBase64Encoded': False
            }
        
        try:
            response = requests.get(
                f'https://api.yookassa.ru/v3/payments/{payment_id}',
                headers={
                    'Authorization': f'Basic {auth_encoded}',
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': response.text,
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Failed to get payment status'}),
                    'isBase64Encoded': False
                }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
