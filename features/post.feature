Feature: Profile posts working


Scenario: I want to make a post on BizzySocial
  Given I am viewing the page at "/bizzyprofile"
  When I enter "Hello" into the "post" input
  And I click on the input with the value "Submit"
  Then I am redirected to the "/post/:id"
  And I can see the BizzyName "MightyGem"
