document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('szamla-details').style.display = 'none';
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('hu-HU').format(num);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('hu-HU').format(date);
};

async function showSzamlaDetails(szamlaId) {
  const response = await fetch(`/api/szamlak/${szamlaId}`);
  const szamla = await response.json();

  // Debug: log the invoice object to check stornozott
  console.log('Számla részletek:', szamla);

  document.querySelector('.kiallito-nev').textContent = szamla.kiallito.nev;
  document.querySelector('.kiallito-cim').textContent = szamla.kiallito.cim;
  document.querySelector('.kiallito-adoszam').textContent = `Adószám: ${szamla.kiallito.adoszam}`;
  document.querySelector('.kiallito-bankszamlaszam').textContent = `Bankszámlaszám: ${szamla.kiallito.bankszamlaszam}`;
  document.querySelector('.kiallito-telefon').textContent = szamla.kiallito.telefon;
  document.querySelector('.kiallito-email').textContent = szamla.kiallito.email;

  document.querySelector('.vevo-nev').textContent = szamla.vevo.nev;
  document.querySelector('.vevo-cim').textContent = szamla.vevo.cim;
  document.querySelector('.vevo-adoszam').textContent = `Adószám: ${szamla.vevo.adoszam}`;
  document.querySelector('.vevo-telefon').textContent = szamla.vevo.telefon;
  document.querySelector('.vevo-email').textContent = szamla.vevo.email;

  document.querySelector('.kelte').textContent = formatDate(szamla.kiallitas_datum);
  document.querySelector('.teljesites').textContent = formatDate(szamla.teljesites_datum);
  document.querySelector('.fizetesi-hatarido').textContent = formatDate(szamla.fizetesi_hatarido);

  document.querySelector('.netto-osszeg').textContent = formatNumber(szamla.netto_osszeg);
  document.querySelector('.afa-kulcs').textContent = szamla.afa_kulcs;
  document.querySelector('.afa-osszeg').textContent = formatNumber(szamla.afa_osszeg);
  document.querySelector('.brutto-osszeg').textContent = formatNumber(szamla.brutto_osszeg);
  
  document.getElementById('szamla-details').style.display = 'block';
}

async function fetchAndRender() {
  const kiallitoRes = await fetch('/api/kiallito');
  const kiallitoList = await kiallitoRes.json();
  const kiallitoUl = document.getElementById('kiallito-list');
  kiallitoUl.innerHTML = '';
  kiallitoList.forEach(k => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${k.nev}</strong><br>
                    ${k.cim}<br>
                    Adószám: ${k.adoszam}<br>
                    Bankszámlaszám: ${k.bankszamlaszam || ''}<br>
                    Telefon: ${k.telefon || ''}<br>
                    Email: ${k.email || ''}`;
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Szerkesztés';
    editBtn.onclick = () => {
      const nev = prompt('Új név:', k.nev);
      const cim = prompt('Új cím:', k.cim);
      const adoszam = prompt('Új adószám:', k.adoszam);
      const bankszamlaszam = prompt('Új bankszámlaszám:', k.bankszamlaszam || '');
      const telefon = prompt('Új telefon:', k.telefon || '');
      const email = prompt('Új email:', k.email || '');
      if (nev && cim && adoszam) {
        fetch(`/api/kiallito/${k.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nev, cim, adoszam, bankszamlaszam, telefon, email })
        }).then(fetchAndRender);
      }
    };
    li.appendChild(editBtn);
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Törlés';
    delBtn.onclick = async () => {
      if (confirm('Biztosan törlöd ezt a kiállítót?')) {
        try {
          const resp = await fetch(`/api/kiallito/${k.id}`, { method: 'DELETE' });
          if (!resp.ok) {
            const err = await resp.json();
            alert('Hiba törléskor: ' + (err.error || 'Ismeretlen hiba.'));
          } else {
            fetchAndRender();
          }
        } catch (e) {
          alert('Hálózati vagy szerver hiba törléskor.');
        }
      }
    };
    li.appendChild(delBtn);
    kiallitoUl.appendChild(li);
  });
  
  const kiallitoSelects = document.querySelectorAll('select[name="kiallito"]');
  kiallitoSelects.forEach(kiallitoSelect => {
    kiallitoSelect.innerHTML = '';
    kiallitoList.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k.id;
      opt.textContent = k.nev;
      kiallitoSelect.appendChild(opt);
    });
  });

  const vevoRes = await fetch('/api/vevok');
  const vevoList = await vevoRes.json();
  const vevoUl = document.getElementById('vevo-list');
  vevoUl.innerHTML = '';
  vevoList.forEach(v => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${v.nev}</strong><br>${v.cim}<br>Adószám: ${v.adoszam}<br>Telefon: ${v.telefon || ''}<br>Email: ${v.email || ''}`;
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Szerkesztés';
    editBtn.onclick = () => {
      const nev = prompt('Új név:', v.nev);
      const cim = prompt('Új cím:', v.cim);
      const adoszam = prompt('Új adószám:', v.adoszam);
      if (nev && cim && adoszam) {
        fetch(`/api/vevok/${v.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nev, cim, adoszam })
        }).then(fetchAndRender);
      }
    };
    li.appendChild(editBtn);
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Törlés';
    delBtn.onclick = async () => {
      if (confirm('Biztosan törlöd ezt a vevőt?')) {
        try {
          const resp = await fetch(`/api/vevok/${v.id}`, { method: 'DELETE' });
          if (!resp.ok) {
            const err = await resp.json();
            alert('Hiba törléskor: ' + (err.error || 'Ismeretlen hiba.'));
          } else {
            fetchAndRender();
          }
        } catch (e) {
          alert('Hálózati vagy szerver hiba törléskor.');
        }
      }
    };
    li.appendChild(delBtn);
    vevoUl.appendChild(li);
  });
  
  // Ensure vevő select is always populated
  const vevoSelect = document.querySelector('select[name="vevo"]');
  if (vevoSelect) {
    vevoSelect.innerHTML = '';
    vevoList.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.nev} (${v.cim})`;
      vevoSelect.appendChild(opt);
    });
  }

  const szamlaRes = await fetch('/api/szamlak');
  const szamlaList = await szamlaRes.json();
  const szamlaUl = document.getElementById('szamla-list');
  szamlaUl.innerHTML = '';
  
  szamlaList.forEach(sz => {
    const li = document.createElement('li');
    li.className = sz.stornozott ? 'stornovalva' : 'szamla-item';
    const szamlaContent = document.createElement('div');
    szamlaContent.className = 'szamla-content';
    szamlaContent.innerHTML = `
      <div>
        <strong>${sz.szamlaszam}</strong>
        ${sz.stornozott ? '<span class="storno-label">STORNÓ</span>' : ''}<br>
        <hr>
        <b>Kiállító adatai:</b><br>
        Név: ${sz.kiallito?.nev || sz.kiallito_nev || ''}<br>
        Cím: ${sz.kiallito?.cim || sz.kiallito_cim || ''}<br>
        Adószám: ${sz.kiallito?.adoszam || sz.kiallito_adoszam || ''}<br>
        Bankszámlaszám: ${sz.kiallito?.bankszamlaszam || sz.kiallito_bankszamlaszam || ''}<br>
        Telefon: ${sz.kiallito?.telefon || sz.kiallito_telefon || ''}<br>
        Email: ${sz.kiallito?.email || sz.kiallito_email || ''}<br>
        <hr>
        <b>Vevő adatai:</b><br>
        Név: ${sz.vevo?.nev || sz.vevo_nev || ''}<br>
        Cím: ${sz.vevo?.cim || sz.vevo_cim || ''}<br>
        Adószám: ${sz.vevo?.adoszam || sz.vevo_adoszam || ''}<br>
        Telefon: ${sz.vevo?.telefon || sz.vevo_telefon || ''}<br>
        Email: ${sz.vevo?.email || sz.vevo_email || ''}<br>
        <hr>
        Kelte: ${formatDate(sz.kiallitas_datum)} | Fizetési határidő: ${formatDate(sz.fizetesi_hatarido)}<br>
        <strong>Összeg: ${formatNumber(sz.brutto_osszeg)} Ft (${sz.afa_kulcs}% ÁFA)</strong>
      </div>
    `;
    szamlaContent.addEventListener('click', () => showSzamlaDetails(sz.szamlaszam));
    li.appendChild(szamlaContent);
    // Add delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Törlés';
    delBtn.className = 'delete-btn';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      if (confirm('Biztosan törlöd ezt a számlát?')) {
        try {
          const resp = await fetch(`/api/szamlak/${sz.id}`, { method: 'DELETE' });
          if (!resp.ok) {
            const err = await resp.json();
            alert('Hiba törléskor: ' + (err.error || 'Ismeretlen hiba.'));
          } else {
            fetchAndRender();
          }
        } catch (e) {
          alert('Hálózati vagy szerver hiba törléskor.');
        }
      }
    };
    li.appendChild(delBtn);
    szamlaUl.appendChild(li);
  });
}

document.getElementById('kiallito-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    nev: formData.get('nev'),
    cim: formData.get('cim'),
    adoszam: formData.get('adoszam'),
    bankszamlaszam: formData.get('bankszamlaszam'),
    telefon: formData.get('telefon'),
    email: formData.get('email')
  };
  try {
    await fetch('/api/kiallito', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    e.target.reset();
    fetchAndRender();
  } catch (error) {
    alert('Hiba történt a kiállító létrehozásakor.');
    console.error(error);
  }
});

document.getElementById('vevo-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    nev: formData.get('nev'),
    cim: formData.get('cim'),
    adoszam: formData.get('adoszam'),
    telefon: formData.get('telefon'),
    email: formData.get('email')
  };
  try {
    await fetch('/api/vevok', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    e.target.reset();
    fetchAndRender();
  } catch (error) {
    alert('Hiba történt a vevő létrehozásakor.');
    console.error(error);
  }
});

document.getElementById('szamla-form').addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    kiallito: formData.get('kiallito'),
    vevo: formData.get('vevo'),
    kelte: formData.get('kelte'),
    teljesites: formData.get('teljesites'),
    fizetesiHatarido: formData.get('fizetesiHatarido'),
    vegosszeg: parseInt(formData.get('vegosszeg')),
    afa: parseInt(formData.get('afa'))
  };
  
  if (data.vegosszeg <= 0) {
    alert('A végösszeg csak pozitív szám lehet!');
    return;
  }
  
  const kelteD = new Date(data.kelte);
  const fizetesiHataridoD = new Date(data.fizetesiHatarido);
  if ((fizetesiHataridoD - kelteD) / (1000*60*60*24) > 30) {
    alert('A fizetési határidő nem lehet több, mint 30 nap a kiállítás dátuma után.');
    return;
  }
  
  try {
    const response = await fetch('/api/szamlak', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    
    if (response.ok) {
      e.target.reset();
      fetchAndRender();
      alert('A számla sikeresen kiállításra került!');
    } else {
      const errorData = await response.json();
      alert(`Hiba: ${errorData.error || 'Ismeretlen hiba történt.'}`);
    }
  } catch (error) {
    alert('Hiba történt a számla kiállításakor.');
    console.error(error);
  }
});

document.getElementById('szamla-form').addEventListener('reset', () => {
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('#szamla-form input[name="kelte"]').value = today;
  document.querySelector('#szamla-form input[name="teljesites"]').value = today;
});

window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('#szamla-form input[name="kelte"]').value = today;
  document.querySelector('#szamla-form input[name="teljesites"]').value = today;
  
  const fizetesiHatarido = new Date();
  fizetesiHatarido.setDate(fizetesiHatarido.getDate() + 15);
  document.querySelector('#szamla-form input[name="fizetesiHatarido"]').value = fizetesiHatarido.toISOString().split('T')[0];
});

fetchAndRender();
