// Node 22 has built-in fetch.


// Node 18+ has built-in fetch. Let's try native fetch first.
// If that fails, I'll use http module.

async function runTest() {
    const API_URL = 'http://localhost:5000/api/feedback';

    console.log('--- STARTING API TEST ---');

    // 1. GET Initial State
    console.log('\n1. Fetching current feedback...');
    try {
        let res = await fetch(API_URL);
        let data = await res.json();
        console.log(`Current Count: ${data.count}`);
    } catch (e) {
        console.error('Failed to connect:', e.message);
        return;
    }

    // 2. POST New Feedback
    console.log('\n2. Submitting new feedback (Alice)...');
    try {
        const payload = { name: "Alice Test", feedback: "End-to-End verified!" };
        let res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status === 201) {
            let data = await res.json();
            console.log('✅ POST Success:', data.data.name, '-', data.data.feedback);
        } else {
            console.log('❌ POST Failed:', await res.text());
        }
    } catch (e) {
        console.error('POST Error:', e);
    }

    // 3. GET to Verify Persistence
    console.log('\n3. Verifying persistence...');
    try {
        let res = await fetch(API_URL);
        let data = await res.json();
        const found = data.data.find(f => f.name === "Alice Test");
        if (found) {
            console.log('✅ Persistence Verified: Found "Alice Test" in DB.');
        } else {
            console.log('❌ Persistence Failed: Alice not found.');
        }
    } catch (e) { console.error(e); }

    // 4. Error Handling (Empty Body)
    console.log('\n4. Testing Error Handling (Empty Data)...');
    try {
        let res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (res.status === 400) {
            console.log('✅ Error Handling Verified: Received 400 Bad Request');
        } else {
            console.log('❌ Error Handling Failed:', res.status);
        }
    } catch (e) { console.error(e); }

    console.log('\n--- TEST COMPLETE ---');
}

runTest();
