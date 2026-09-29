# Event Planner - Software Testing

## 1. Project Overview

**Project Name:** Event Planner  
**Technology Used:** HTML, CSS and JavaScript  
**Testing Type:** Manual Testing

Event Planner is a web-based application developed using HTML, CSS and JavaScript. It is designed to manage and display event-related information through a simple and user-friendly interface.

Software testing was carried out to check the functionality, input handling, user interface and overall behavior of the application.

---

## 2. Testing Objectives

The main objectives of testing were:

- To verify the main functionality of the application.
- To check whether event information is entered and displayed correctly.
- To verify form and input validation.
- To test buttons and user interactions.
- To check the application behavior with valid and invalid inputs.
- To check the user interface and responsive layout.
- To identify possible errors and unexpected behavior.

---

## 3. Testing Methodology

Manual testing was used for the Event Planner application.

The following testing techniques were considered:

- Functional Testing
- Positive Testing
- Negative Testing
- Input Validation Testing
- UI Testing
- Responsive Testing
- Browser Console Testing

The application was tested by performing different user actions and checking the expected behavior.

---

## 4. Test Environment

| Item | Details |
|---|---|
| Application | Event Planner |
| Technology | HTML, CSS, JavaScript |
| Browser | Google Chrome |
| Testing Method | Manual Testing |
| Operating System | Windows |
| Tester | Vaishnavi |

---

## 5. Functional Testing

### TC-01: Application Loading

**Test:** Open the Event Planner application in the browser.

**Expected Result:**  
The application should load correctly and the main interface should be visible.

**Test Status:** Pass

---

### TC-02: Event Creation

**Test:** Enter valid event information and submit the form.

**Expected Result:**  
The event should be added successfully and the entered information should be displayed correctly.

**Test Status:** Pass

---

### TC-03: Multiple Event Entries

**Test:** Enter details for more than one event.

**Expected Result:**  
Each event should be displayed separately without affecting the other event information.

**Test Status:** Pass

---

### TC-04: Empty Input Validation

**Test:** Submit the event form without entering the required information.

**Expected Result:**  
The application should prevent invalid submission or display an appropriate validation message.

**Test Status:** Pass

---

### TC-05: Event Information Verification

**Test:** Compare the information entered in the form with the information displayed after submission.

**Expected Result:**  
The displayed event information should match the entered information.

**Test Status:** Pass

---

### TC-06: Event Status

**Test:** Change the available status of an event.

**Expected Result:**  
The selected event status should be displayed correctly.

**Test Status:** Pass

---

### TC-07: Button Functionality

**Test:** Click the available buttons and controls in the application.

**Expected Result:**  
Each button should perform its intended action.

**Test Status:** Pass

---

## 6. Negative Testing

Negative testing was considered to check how the application handles incorrect or incomplete input.

| Test ID | Test Scenario | Expected Behavior |
|---|---|---|
| NT-01 | Submit form with empty fields | Invalid submission should be prevented or validation should be displayed. |
| NT-02 | Enter incomplete event information | Application should handle the input properly. |
| NT-03 | Enter a long event name | Application should handle the input without breaking the layout. |
| NT-04 | Submit the form repeatedly | Application should not behave unexpectedly. |

---

## 7. Input Validation Testing

The input fields were checked with different types of input.

The following conditions were considered:

- Valid event information
- Empty required fields
- Incomplete information
- Different event names
- Different date values
- Long text input

The purpose of this testing was to verify that invalid or incomplete information is handled appropriately.

---

## 8. UI Testing

The user interface was checked for the following:

- Proper alignment of elements
- Visibility of input fields
- Visibility and usability of buttons
- Readability of text
- Proper spacing
- Correct display of event information
- No unnecessary overlapping of elements

The application was also checked at different screen sizes to verify basic responsive behavior.

---

## 9. Browser Console Testing

Chrome Developer Tools were used to check the browser console while interacting with the application.

The following checks were considered:

- JavaScript errors
- Unexpected console messages
- Errors during form submission
- Errors during button interactions

This helps identify issues that may not be directly visible on the webpage.

---

## 10. Bug Reporting

Any defect found during testing can be documented using the following format:

| Bug ID | Test Case | Description | Expected Result | Actual Result | Severity | Status |
|---|---|---|---|---|---|---|
| BUG-01 | TC-__ | Application issue identified during testing | Expected behavior | Observed behavior | Low/Medium/High | Open/Fixed |
| BUG-02 | TC-__ | Application issue identified during testing | Expected behavior | Observed behavior | Low/Medium/High | Open/Fixed |

### Bug Severity

**Low:** Minor UI, text or cosmetic issue.

**Medium:** A feature is not working correctly but the application can still be used.

**High:** An important functionality is affected and the user cannot complete an important task.

---

## 11. Retesting

After fixing a defect, the related test case should be executed again to verify the fix.

The retesting process is:

**Bug Identified → Bug Reported → Bug Fixed → Test Case Re-executed → Fix Verified**

---

## 12. Testing Summary

The Event Planner application was evaluated using manual software testing techniques.

| Testing Area | Status |
|---|---|
| Functional Testing | Tested |
| Input Validation | Tested |
| Negative Testing | Checked |
| UI Testing | Checked |
| Responsive Testing | Checked |
| Browser Console Testing | Checked |

---

## 13. Testing Evidence

The following screenshots can be maintained as testing evidence:

- Event creation screen
- Event displayed after submission
- Input validation message
- Event status update
- Application desktop view
- Application mobile/responsive view
- Browser console
- Any defect identified during testing

---

## 14. Testing Tools

The following tools were used:

- **Google Chrome** - Application execution and testing
- **Chrome Developer Tools** - Console and responsive testing
- **GitHub** - Source code and project documentation
- **Markdown** - Testing documentation

---

## 15. Conclusion

The Event Planner application was evaluated using manual testing techniques covering functional behavior, input validation, negative scenarios, user interface and responsive behavior.

The testing documentation provides a structured approach for identifying application issues, documenting defects and verifying fixes through retesting.

Overall, the testing process helps ensure that the implemented features provide the expected behavior and a usable experience for the user.
