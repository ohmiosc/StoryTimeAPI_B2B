Feature: client.api: Save Optin
    @notAllowedForProd
    @after-removeDeviceIdFromDynamoDB
    Scenario: Do valid Save Optin with email and isAdult = 1
        Given I launch application
        Given I clean extra tables data
        Given I do alternative login for active user
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": ${user.productID},
                "deviceID": ${user.deviceID},
                "appUserID": ${user.appUserID},
                "isAdult": 1
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                "deviceID": ${user.deviceID},
                "userType": 4,
                "appUserID": ${user.appUserID},
                "isSucceeded": 1
            }
            """
    @notAllowedForProd
    @after-removeDeviceIdFromDynamoDB
    Scenario: Do valid Save Optin with isAdult = 0
        Given I launch application
        Given I clean extra tables data
        Given I do alternative login for active user
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": ${user.productID},
                "deviceID": ${user.deviceID},
                "appUserID": ${user.appUserID},
                "isAdult": 1,
                "email": "test@test.com"
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                "deviceID": ${user.deviceID},
                "userType": 4,
                "appUserID": ${user.appUserID},
                "isSucceeded": 1
            }
            """

    Scenario: Save Optin without productID
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "deviceID": "test",
                "appUserID": "test",
                "isAdult": 1,
                "email": "test@test.com"
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                "message": "Input parameter productID is empty or has wrong format",
                "statusCode": 400,
                "status": "Bad Request"
            }
            """

    Scenario: Save Optin without deviceID
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "disneystorytime-pt",
                "appUserID": "test",
                "isAdult": 1,
                "email": "test@test.com"
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
               "message": "Input parameter deviceID is empty or has wrong format",
               "statusCode": 400,
               "status": "Bad Request"
            }
            """

    Scenario: Do Save Optin without appUserID
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "disneystorytime-pt",
                "deviceID": "test",
                "isAdult": 1,
                "email": "test@test.com"
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
               "message": "Input parameter appUserID is empty or has wrong format",
               "statusCode": 400,
               "status": "Bad Request"
            }
            """

    Scenario: Do Save Optin without isAdult
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "disneystorytime-pt",
                "deviceID": "test",
                "appUserID": "test",
                "email": "test@test.com"
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
               "message": "Input parameter isAdult is empty or has wrong format",
               "statusCode": 400,
               "status": "Bad Request"
            }
            """

    Scenario: Do Save Optin with isAdult = 0 and without email
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "disneystorytime-pt",
                "deviceID": "test",
                "appUserID": "test",
                "isAdult": 0
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                "message": "The body should contain email if isAdult = 0",
                "statusCode": 400,
                "status": "Bad Request"
            }
            """

    Scenario: Do Save Optin with wrong productID format
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "test",
                "deviceID": "test",
                "appUserID": "test",
                "isAdult": 1
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                "message": "ProductID test has wrong format",
                "statusCode": 400,
                "status": "Bad Request"
            }
            """

    Scenario: Do Save Optin with non-existed user
        When I do call "POST:/appuser/saveoptin" with data:
            """
            {
                "productID": "disneystorytime-pt",
                "deviceID": "test",
                "appUserID": "test",
                "isAdult": 1
            }
            """
        Then I receives status code "200"
        And The response should contain:
            """
            {
                 "message": "User with id = test not found",
                 "statusCode": 404,
                 "status": "Not found"
            }
            """

