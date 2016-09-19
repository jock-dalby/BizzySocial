Feature: Registration page working

@watch
Scenario: I want to register with BizzySocial
  Given I am viewing the page at "/register"
  When I enter "peas" into the "userName" input
  And I enter "password123" into the "password" input
  And I click on the input with the value "Register"
  Then I am redirected to the "/register/success"
  And I can see the BizzyName "peas"
