const fs = require('fs');
const apiKey = "test_94334a116470fe8849985369bd03c74efb12501260bcc7a55ba5b70068569c55efe8d04e6d233bd35cf2fabdeb93fb0d";
const BASE_URL = 'https://open.api.nexon.com/maplestorytw/v1';

async function fetchAndSave(name) {
    try {
        const resId = await fetch(`${BASE_URL}/id?character_name=${encodeURIComponent(name)}`, {
            headers: { 'x-nxopen-api-key': apiKey }
        });
        const idData = await resId.json();
        const ocid = idData.ocid;

        const resEq = await fetch(`${BASE_URL}/character/item-equipment?ocid=${ocid}`, {
            headers: { 'x-nxopen-api-key': apiKey }
        });
        const eqData = await resEq.json();
        
        fs.writeFileSync('debug_equipment.json', JSON.stringify(eqData.item_equipment, null, 2), 'utf8');
        console.log("Successfully saved to debug_equipment.json");
    } catch (e) {
        console.error("Error:", e);
    }
}

fetchAndSave("赤瞳o蓮花");
