 Feature: client.api: Login regular
    @testLog
    @notAllowedForProd
    @after-removeDeviceIdFromDynamoDB
    @after-removeDeviceFromDynamoDB
     Scenario: Do valid regular login
        Given I launch application
		Given I clean extra tables data
        Given I send IAPReceipt
        Given I perform sign up
         When I do call "POST" request to "/appuser/loginregular" for login with body:
             """
             {
             "productID": ${user.productID},
             "deviceID": ${user.deviceID},
             "appUserID": ${user.appUserID},
             "email": ${user.email},
             "password": ${user.password},
             "registrationType": 1
             }
             """
         Then I receives status code "200"
         And The response should contain:
             """
             {
             "productID": ${user.productID},
             "deviceID": ${user.deviceID},
             "appUserID": ${user.appUserID},
             "isSucceeded": 1,
             "userType": 1,
             "failureReason": 0
             }
             """
   @notAllowedForProd
   @after-removeDeviceIdFromDynamoDB
   @after-removeDeviceFromDynamoDB
   Scenario: Do regular login with wrong email
     Given I launch application
     Given I clean extra tables data
     Given I send IAPReceipt
     Given I perform sign up
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "productID": ${user.productID},
             "deviceID": ${user.deviceID},
             "appUserID": ${user.appUserID},
             "email": "email@mail.email",
             "password": ${user.password},
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
              "appUserID": ${user.appUserID},
              "deviceID": ${user.deviceID},
              "failureReason": 3,
              "isSucceeded": 0,
              "productID": ${user.productID},
              "userType": 1
              }
             """

   @notAllowedForProd
   @after-removeDeviceIdFromDynamoDB
   @after-removeDeviceFromDynamoDB
   Scenario: Do regular login with wrong password
     Given I launch application
     Given I clean extra tables data
     Given I send IAPReceipt
     Given I perform sign up
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "productID": ${user.productID},
             "deviceID": ${user.deviceID},
             "appUserID": ${user.appUserID},
             "email": ${user.email},
             "password": "wrong_password",
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
              "appUserID": ${user.appUserID},
              "deviceID": ${user.deviceID},
              "failureReason": 4,
              "isSucceeded": 0,
              "productID": ${user.productID},
              "userType": 1
              }
             """

   @notAllowedForProd
   @after-removeDeviceIdFromDynamoDB
   @after-removeDeviceFromDynamoDB
   Scenario: Do regular login with wrong email format
     Given I launch application
     Given I clean extra tables data
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "productID": ${user.productID},
             "deviceID": ${user.deviceID},
             "appUserID": ${user.appUserID},
             "email": "test @ test",
             "password": "Something3",
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
              "statusCode": 400,
              "status": "Bad Request",
              "message": "Validation failed:: email must be a valid email"
             }
             """



    Scenario: Do regular login with missed appUserID
      When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "productID": "disneystorytime-pt",
             "deviceID": "test",
             "email": "test@test.com",
             "password": "Something3",
             "registrationType": 1
             }
             """
      Then I receives status code "200"
      And The response should contain:
             """
             {
             "statusCode": 400,
             "status": "Bad Request",
             "message": "Validation failed:: appUserID is required"
             }
             """

    Scenario: Do regular login with missed productID
      When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "appUserID": "test",
             "deviceID": "test",
             "email": "test@test.com",
             "password": "Something3",
             "registrationType": 1
             }
             """
      Then I receives status code "200"
      And The response should contain:
             """
             {
             "statusCode": 400,
             "status": "Bad Request",
             "message": "Validation failed:: productID is required"
             }
             """

   Scenario: Do regular login with missed email
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "appUserID": "test",
             "productID": "disneystorytime-pt",
             "deviceID": "test",
             "password": "Something3",
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
             "statusCode": 400,
             "status": "Bad Request",
             "message": "Validation failed:: email is required"
             }
             """

   Scenario: Do regular login with missed deviceID
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "appUserID": "test",
             "productID": "disneystorytime-pt",
             "email": "test@test.com",
             "password": "Something3",
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
             "statusCode": 400,
             "status": "Bad Request",
             "message": "Validation failed:: deviceID is required"
             }
             """

   Scenario: Do regular login with missed registrationType
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "appUserID": "test",
             "productID": "disneystorytime-pt",
             "deviceID": "test",
             "email": "test@test.com",
             "password": "Something3"
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
             "statusCode": 400,
             "status": "Bad Request",
             "message": "Validation failed:: registrationType is required"
             }
             """
   Scenario: Do regular login with non-existed appUser
     When I do call "POST" request to "/appuser/loginregular" with body:
             """
             {
             "productID": "disneystorytime-pt",
             "deviceID": "test",
             "appUserID": "non-existed",
             "email": "test@test.com",
             "password": "Something3",
             "registrationType": 1
             }
             """
     Then I receives status code "200"
     And The response should contain:
             """
             {
             "statusCode": 404,
             "status": "Not found"
             }
             """

