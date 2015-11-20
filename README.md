# ejson_test_case

Test case for Meteor EJSON parsing speed of complex objects.

Generates updates to random records at server-side every second, testing how fast the client-side collection stack parses them.

Clone, launch with Meteor, adjust count of records / complexity / nesting depth and obeserve with CPU profiler.
