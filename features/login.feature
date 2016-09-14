Feature: Login page working


Scenario: I want to login to BizzySocial
  Given I am viewing the page at "/"
  When I enter "Harrods" into the "bizzyName" input
  And I enter "password123" into the "bizzyPassword" input
  And I click on the input with the value "Log in"
  Then I am redirected to the "/harrods"
  And I can see the BizzyName "Harrods"
