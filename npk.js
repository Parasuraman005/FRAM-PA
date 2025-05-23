const SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb'; // Replace with actual service UUID
const CHARACTERISTIC_UUID = '00005678-0000-1000-8000-00805f9b34fb'; // Replace with actual characteristic UUID

async function refreshBluetooth() {
  const status = document.getElementById("status");
  status.textContent = "Scanning for devices...";
  status.classList.add("connecting");
  status.style.color = "#333";

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    const value = await characteristic.readValue();

    const decoder = new TextDecoder("utf-8");
    const npkData = decoder.decode(value);
    console.log("Received:", npkData);

    const parts = npkData.split(',');
    const npk = {};
    parts.forEach(part => {
      const [key, val] = part.split(':');
      npk[key.trim()] = val.trim();
    });

    if (!npk["N"] || !npk["P"] || !npk["K"]) {
      status.textContent = "Invalid data received. Please retry.";
      status.style.color = "red";
      status.classList.remove("connecting");
      return;
    }

    // Autofill input fields
    document.getElementById("nVal").value = npk["N"];
    document.getElementById("pVal").value = npk["P"];
    document.getElementById("kVal").value = npk["K"];

    // Save to localStorage
    localStorage.setItem("npk", JSON.stringify(npk));

    status.textContent = `Connected: ${device.name}`;
    status.style.color = "green";
  } catch (error) {
    console.error(error);
    status.textContent = "Bluetooth connection failed. Ensure device is on and in range.";
    status.style.color = "red";
  } finally {
    status.classList.remove("connecting");
  }
}

function calculate() {
  const n = document.getElementById("nVal").value;
  const p = document.getElementById("pVal").value;
  const k = document.getElementById("kVal").value;
  const status = document.getElementById("status");

  if (n && p && k) {
    status.textContent = "Redirecting...";
    status.style.color = "#333";

    // Optional: pass values to next page
    const params = new URLSearchParams({ n, p, k });
    window.location.href = `recommend.html?${params.toString()}`;
  } else {
    status.textContent = "Please enter or fetch all NPK values.";
    status.style.color = "red";
  }
}

// Prefill NPK fields on load if saved
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("npk"));
  if (saved) {
    document.getElementById("nVal").value = saved["N"];
    document.getElementById("pVal").value = saved["P"];
    document.getElementById("kVal").value = saved["K"];
  }
});