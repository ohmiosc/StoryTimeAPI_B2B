import os
import ast
import boto3
import sys


def lambda_handler(event, context):
    my_session = boto3.session.Session()
    my_region = my_session.region_name
    region_names = {"eu-west-1": "Ireland", "us-east-1": "N. Virginia", "us-east-2": "Ohio",
                    "eu-central-1": "Frankfurt"}
    region = os.environ['AWS_DEFAULT_REGION']
    s3 = boto3.resource('s3', region_name=region, verify=False)
    src_bucket = region_names[my_region].lower() + '-' + os.environ['DISNEY_ENV'] + '-staged'
    dst_bucket = src_bucket
    bucket = s3.Bucket(dst_bucket)

    print "Region: ", region
    print "Source bucket: ", src_bucket
    print "Destination bucket: ", dst_bucket
    print "Page file: ", str(event['pageName'])

    extra_args = {'ACL': 'public-read'}

    copy_page = {
        'Bucket': src_bucket,
        'Key': event['prodName'].lower() + '/page/' + str(event['pageName'])
    }
    bucket.copy(copy_page, event['destinationProdName'].lower() + '/page/' + str(event['pageName']), ExtraArgs=extra_args)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DISNEY_ENV'] + '_Media')

    for i in event['media']:
        print i
        for k in event['media'][i]:
            print k
            print event['prodName'].lower() + '/' + i + '/' + k
            copy_media = {
                'Bucket': src_bucket,
                'Key': event['prodName'].lower() + '/' + i + '/' + k
            }
            try:
                bucket.copy(copy_media, event['destinationProdName'].lower() + '/' + i + '/' + k, ExtraArgs=extra_args)
            except:
                print("Oops!", sys.exc_info()[0], "occurred while coping media")
            try:
                table.update_item(
                    Key={
                        'id': event['destinationProdName'].lower() + '/' + i + '/' + k
                    },
                    UpdateExpression='SET published = :val',
                    ExpressionAttributeValues={
                        ':val': 1
                    }
                )
            except:
                print("Oops!", sys.exc_info()[0], "occurred while updating item")

