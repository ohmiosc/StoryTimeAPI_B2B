Feature: client.api: Send IAP Receipt
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Send valid IAP Receipt
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/sendiapreceipt" with body:
      """
        {
          "productID":${user.productID},
          "deviceID":${user.deviceID},
          "appUserID":${user.appUserID},
          "appsFlyerID": "ewrkhg32h4v4b23vn4",
          "package": {
                "storeID": 2,
                "productID": "launch_lifetime_299",
                "productType": 3,
                "transactionID": "9191976592590172960.1857763235915559",
                "receipt": "{\"Store\":\"GooglePlay\",\"TransactionID\":\"9191976592590172960.1857763235915559\",\"Payload\":\"{\\\"json\\\":\\\"{\\\\\\\"orderId\\\\\\\":\\\\\\\"9191976592590172960.1857763235915559\\\\\\\",\\\\\\\"packageName\\\\\\\":\\\\\\\"com.LaMark.DisneyStorytime\\\\\\\",\\\\\\\"productId\\\\\\\":\\\\\\\"launch_ft_yearly_94.99\\\\\\\",\\\\\\\"purchaseTime\\\\\\\":1553917621968,\\\\\\\"purchaseState\\\\\\\":0,\\\\\\\"developerPayload\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"developerPayload\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"is_free_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"has_introductory_price_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"is_updated\\\\\\\\\\\\\\\":false}\\\\\\\",\\\\\\\"purchaseToken\\\\\\\":\\\\\\\"akkbgmhjfhhgofmjhmcgophd.AO-J1OzFoTnmqio7hdQKHdB2qgiPfXwZVCyAH174N5yKPndGORW4aZO3WGK0PKtLxrtv9p0wQjaYOYACJnKords_OUlS4k2H1104xblHo1bYc1T__WwaXL-McG-oUeHRpOUjuCyUpkFaSaPImUjQER1NJBWMURYNZg\\\\\\\"}\\\",\\\"signature\\\":\\\"Zh6ny7iG7wLvONKoy9lYtr190TNjcbkf4UxW0jT9APk87CgH2f7KKK5uO6VdqQSWUIceJdu87IO7XLjttBU1H5\\\\/j7R\\\\/nOFoqOw3vFI2jY\\\\/l9fXJUlRmb1MRVXPkiMOuopDz\\\\/80PqiU0f+OFW2wLu0CT\\\\/ffT0fIm3XyikKtDbjbGYXwgFdQaUwzTg8OCL5rcxmiqKusFY3YaAk\\\\/iXEpV2Cng3Eeym33NjKhqF7iOnV4gnmHVgp0Pi4DPjVFvB4ZQbd1RAaiTXjQUGxY3l7zqS7YgkZjq4MazOE\\\\/8b2rt9LEJ83s6h4Z1sfZ5AByp9qn8pbYv5s+Y8mCrTyBD0YJd8Ew==\\\",\\\"skuDetails\\\":\\\"{\\\\\\\"productId\\\\\\\":\\\\\\\"launch_lifetime_299\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"inapp\\\\\\\",\\\\\\\"price\\\\\\\":\\\\\\\"0.60\\\\\\\",\\\\\\\"title\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"price_amount_micros\\\\\\\":60000000,\\\\\\\"price_currency_code\\\\\\\":\\\\\\\"USD\\\\\\\"}\\\",\\\"isPurchaseHistorySupported\\\":true}\"}",
                "isoCurrencyCode": "USD",
                "localizedPrice": "0.60",
                "purchaseDate": "",
                "subscriptionData": {
                    "isFreeTrial": 0,
                    "remainingTime": "",
                    "isIntroductoryPricePeriod": 0,
                    "introductoryPricePeriod": "",
                    "introductoryPricePeriodCycles": 0,
                    "introductoryPrice": "",
                    "expireDate": ""
                }
          }
        }
	   """
    Then I receives status code "200"
    And The response should contain:
			"""
			{
              "deviceID": ${user.deviceID},
              "productID": ${user.productID},
              "appUserID": ${user.appUserID},
              "userType": 1,
              "failureReason": 0
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Send Non Consumable IAP Receipt
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/sendiapreceipt" with body:
      """
        {
          "productID":${user.productID},
          "deviceID":${user.deviceID},
          "appUserID":${user.appUserID},
          "appsFlyerID": "ewrkhg32h4v4b23vn4",
          "package": {
                "storeID": 2,
                "productID": "launch_lifetime_299",
                "productType": 3,
                "transactionID": "9191976592590172960.1857763235915559",
                "receipt": "{\"Store\":\"GooglePlay\",\"TransactionID\":\"9191976592590172960.1857763235915559\",\"Payload\":\"{\\\"json\\\":\\\"{\\\\\\\"orderId\\\\\\\":\\\\\\\"9191976592590172960.1857763235915559\\\\\\\",\\\\\\\"packageName\\\\\\\":\\\\\\\"com.LaMark.DisneyStorytime\\\\\\\",\\\\\\\"productId\\\\\\\":\\\\\\\"launch_ft_yearly_94.99\\\\\\\",\\\\\\\"purchaseTime\\\\\\\":1553917621968,\\\\\\\"purchaseState\\\\\\\":0,\\\\\\\"developerPayload\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"developerPayload\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"is_free_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"has_introductory_price_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"is_updated\\\\\\\\\\\\\\\":false}\\\\\\\",\\\\\\\"purchaseToken\\\\\\\":\\\\\\\"akkbgmhjfhhgofmjhmcgophd.AO-J1OzFoTnmqio7hdQKHdB2qgiPfXwZVCyAH174N5yKPndGORW4aZO3WGK0PKtLxrtv9p0wQjaYOYACJnKords_OUlS4k2H1104xblHo1bYc1T__WwaXL-McG-oUeHRpOUjuCyUpkFaSaPImUjQER1NJBWMURYNZg\\\\\\\"}\\\",\\\"signature\\\":\\\"Zh6ny7iG7wLvONKoy9lYtr190TNjcbkf4UxW0jT9APk87CgH2f7KKK5uO6VdqQSWUIceJdu87IO7XLjttBU1H5\\\\/j7R\\\\/nOFoqOw3vFI2jY\\\\/l9fXJUlRmb1MRVXPkiMOuopDz\\\\/80PqiU0f+OFW2wLu0CT\\\\/ffT0fIm3XyikKtDbjbGYXwgFdQaUwzTg8OCL5rcxmiqKusFY3YaAk\\\\/iXEpV2Cng3Eeym33NjKhqF7iOnV4gnmHVgp0Pi4DPjVFvB4ZQbd1RAaiTXjQUGxY3l7zqS7YgkZjq4MazOE\\\\/8b2rt9LEJ83s6h4Z1sfZ5AByp9qn8pbYv5s+Y8mCrTyBD0YJd8Ew==\\\",\\\"skuDetails\\\":\\\"{\\\\\\\"productId\\\\\\\":\\\\\\\"launch_lifetime_299\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"inapp\\\\\\\",\\\\\\\"price\\\\\\\":\\\\\\\"0.60\\\\\\\",\\\\\\\"title\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"price_amount_micros\\\\\\\":60000000,\\\\\\\"price_currency_code\\\\\\\":\\\\\\\"USD\\\\\\\"}\\\",\\\"isPurchaseHistorySupported\\\":true}\"}",
                "isoCurrencyCode": "USD",
                "localizedPrice": "0.60",
                "purchaseDate": "",
                "subscriptionData": {
                    "isFreeTrial": 0,
                    "isIntroductoryPricePeriod": 0,
                    "introductoryPrice": ""
                }
          }
        }
	   """
    Then I receives status code "200"
    And The response should contain:
			"""
			{
              "deviceID": ${user.deviceID},
              "productID": ${user.productID},
              "appUserID": ${user.appUserID},
              "userType": 1,
              "failureReason": 0
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Send IAP with non-existed token
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/sendiapreceipt" with body:
      """
        {
          "productID":${user.productID},
          "deviceID":${user.deviceID},
          "appUserID":${user.appUserID},
          "appsFlyerID": "ewrkhg32h4v4b23vn4",
          "package": {
                "storeID": 2,
                "productID": "launch_lifetime_299",
                "productType": 3,
                "transactionID": "9191976592590172960.1857763235915559",
                "receipt": "{\"Store\":\"GooglePlay\",\"TransactionID\":\"9191976592590172960.1857763235915559\",\"Payload\":\"{\\\"json\\\":\\\"{\\\\\\\"orderId\\\\\\\":\\\\\\\"9191976592590172960.1857763235915559\\\\\\\",\\\\\\\"packageName\\\\\\\":\\\\\\\"com.LaMark.DisneyStorytime\\\\\\\",\\\\\\\"productId\\\\\\\":\\\\\\\"launch_ft_yearly_94.99\\\\\\\",\\\\\\\"purchaseTime\\\\\\\":1553917621968,\\\\\\\"purchaseState\\\\\\\":0,\\\\\\\"developerPayload\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"developerPayload\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"is_free_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"has_introductory_price_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"is_updated\\\\\\\\\\\\\\\":false}\\\\\\\",\\\\\\\"purchaseToken\\\\\\\":\\\\\\\".AO-J1OzFoTnmqio7hdQKHdB2qgiPfXwZVCyAH174N5yKPndGORW4aZO3WGK0PKtLxrtv9p0wQjaYOYACJnKords_OUlS4k2H1104xblHo1bYc1T__WwaXL-McG-oUeHRpOUjuCyUpkFaSaPImUjQER1NJBWMURYNZg\\\\\\\"}\\\",\\\"signature\\\":\\\"Zh6ny7iG7wLvONKoy9lYtr190TNjcbkf4UxW0jT9APk87CgH2f7KKK5uO6VdqQSWUIceJdu87IO7XLjttBU1H5\\\\/j7R\\\\/nOFoqOw3vFI2jY\\\\/l9fXJUlRmb1MRVXPkiMOuopDz\\\\/80PqiU0f+OFW2wLu0CT\\\\/ffT0fIm3XyikKtDbjbGYXwgFdQaUwzTg8OCL5rcxmiqKusFY3YaAk\\\\/iXEpV2Cng3Eeym33NjKhqF7iOnV4gnmHVgp0Pi4DPjVFvB4ZQbd1RAaiTXjQUGxY3l7zqS7YgkZjq4MazOE\\\\/8b2rt9LEJ83s6h4Z1sfZ5AByp9qn8pbYv5s+Y8mCrTyBD0YJd8Ew==\\\",\\\"skuDetails\\\":\\\"{\\\\\\\"productId\\\\\\\":\\\\\\\"launch_lifetime_299\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"inapp\\\\\\\",\\\\\\\"price\\\\\\\":\\\\\\\"0.60\\\\\\\",\\\\\\\"title\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"price_amount_micros\\\\\\\":60000000,\\\\\\\"price_currency_code\\\\\\\":\\\\\\\"USD\\\\\\\"}\\\",\\\"isPurchaseHistorySupported\\\":true}\"}",
                "isoCurrencyCode": "USD",
                "localizedPrice": "0.60",
                "purchaseDate": "",
                "subscriptionData": {
                    "isFreeTrial": 0,
                    "isIntroductoryPricePeriod": 0,
                    "introductoryPrice": "123"
                }
          }
        }
	   """
    Then I receives status code "200"
    And The response should contain:
			"""
			{
              "isSucceeded": 0
			}
			"""

