Feature: Login page working


Scenario: I want to login to BizzySocial
  Given I am viewing the page at "/"
  When I enter "MightyGem" into the "name" input
  And I enter "password123" into the "password" input
  And I click on the input with the value "Log in"
  Then I am redirected to the "/bizzyprofile"
  And I can see the BizzyName "MightyGem"
