Feature: Registration page working

@watch
Scenario: I want to register with BizzySocial
  Given I am viewing the page at "/register"
  When I enter "McDonalds" into the "bizzyName" input
  And I click on the input with the value "Register"
  Then I am redirected to the "/mcdonalds"
  And I can see the BizzyName "McDonalds"
