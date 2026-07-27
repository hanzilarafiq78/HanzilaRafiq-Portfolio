// CONFIGURE: replace with your Formspree endpoint URL (or other form-to-email endpoint).
// Example Formspree endpoint: https://formspree.io/f/your-form-id
const EMAIL_ENDPOINT = "https://formspree.io/f/mpqvkvgq";

async function addRecommendation() {
  // Get the name and message of the new recommendation
  let nameEl = document.getElementById("recommender_name");
  let recommendation = document.getElementById("new_recommendation");
  let name = nameEl ? nameEl.value.trim() : "";
  let message = recommendation.value ? recommendation.value.trim() : "";

  // Validate endpoint
  if (!EMAIL_ENDPOINT || EMAIL_ENDPOINT.includes('your-form-id')) {
    alert('Please set the EMAIL_ENDPOINT in script.js to your form endpoint (e.g. Formspree) before submitting.');
    return;
  }

  // If the user has left a recommendation, try to send it to the configured endpoint
  if (message !== "") {
    console.log("Sending new recommendation to endpoint...");

    // Disable the submit button to prevent duplicate submissions
    const btn = document.getElementById("recommend_btn");
    if (btn) btn.disabled = true;

    // Prepare JSON payload
    const payload = { name: name, message: message };

    try {
      const resp = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(payload)
      });

      // Try to get informative response body
      let respBody = null;
      try { respBody = await resp.json(); } catch(e) { try { respBody = await resp.text(); } catch(e2) { respBody = null; } }

      if (resp.ok) {
        // On success: add the recommendation to the page and show popup
        var element = document.createElement("div");
        element.setAttribute("class","recommendation");
        var content = "<span>\u201C</span>" + message + "<span>\u201D</span>";
        element.innerHTML = content;
        document.getElementById("all_recommendations").appendChild(element);

        // Clear inputs
        recommendation.value = "";
        if (nameEl) nameEl.value = "";

        showPopup(true);
        console.log('Recommendation sent successfully. Server response:', respBody);
      } else {
        console.error('Failed to send recommendation', resp.status, resp.statusText, respBody);
        alert('Sorry — could not send recommendation. Server returned ' + resp.status + '. Check console for details.');
      }
    } catch (err) {
      console.error('Error sending recommendation:', err);
      alert('Sorry — an error occurred while sending your recommendation. This commonly happens when the endpoint blocks CORS. Check the browser console for details or use a Formspree endpoint which supports CORS.');
    } finally {
      if (btn) btn.disabled = false;
    }
  } else {
    alert('Please write a message before submitting.');
  }
}

function showPopup(bool) {
  if (bool) {
    document.getElementById('popup').style.visibility = 'visible'
  } else {
    document.getElementById('popup').style.visibility = 'hidden'
  }
}
