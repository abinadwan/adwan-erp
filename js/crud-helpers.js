// This file contains helpers for common CRUD operations (Create, Read, Update, Delete)
// It helps to reduce code duplication across pages like employees.js, departments.js, etc.

/**
 * Creates a generic table renderer.
 * @param {object} config
 * @param {string} config.tableBodyId - The ID of the table body element.
 * @param {Array<object>} config.columns - Configuration for table columns.
 * @param {Function} config.getActions - Function to generate action buttons for a row.
 * @param {Function} config.getDataSource - Function that returns the data array to render.
 * @returns {Function} A render function that accepts an optional filter string.
 */
function createTableRenderer({ tableBodyId, columns, getActions, getDataSource }) {
  const tableBody = document.getElementById(tableBodyId);

  return async function render(filter = '') {
    while (tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);

    const { data, error } = await getDataSource(filter);
    if (error) {
      console.error('Error fetching data for table:', error);
      return;
    }

    const searchTerm = filter.toLowerCase().trim();

    const filteredData = data.filter(item => {
      if (!searchTerm) return true;
      // Generic search across all configured columns
      return columns.some(col => {
        const value = col.lookup ? col.lookup(item) : item[col.key];
        return String(value).toLowerCase().includes(searchTerm);
      });
    });

    filteredData.forEach(item => {
      const tr = document.createElement('tr');
      columns.forEach(async col => {
        const td = document.createElement('td');
        // Use a lookup function if provided (e.g., for department names)
        td.textContent = col.lookup ? await col.lookup(item) : item[col.key];
        tr.appendChild(td);
      });

      // Add action buttons
      const actions = getActions(item);
      if (actions) {
        const tdActions = document.createElement('td');
        actions.forEach(button => tdActions.appendChild(button));
        tr.appendChild(tdActions);
      }
      tableBody.appendChild(tr);
    });

    // Apply role-based UI restrictions to newly created elements
    const session = getSession();
    if (session) {
        setupRoleUI(session);
    }
  };
}

/**
 * Initializes a page with CRUD functionality using a modal form.
 * @param {object} config
 * @param {string} config.entityName - The name of the entity (e.g., 'employee').
 * @param {Function} config.renderFn - The render function for the table.
 * @param {Array<object>} config.formFields - Maps form input IDs to data keys.
 * @param {Function} [config.validateFn] - Optional validation function for the form data.
 * @param {Function} [config.populateFn] - Optional function to populate form selects, etc.
 */
async function initializeModalCrud({ entityName, renderFn, formFields, validateFn, populateFn }) {
  // Modal and form elements
  const modal = document.getElementById('formModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById(`${entityName}Form`);
  const addBtn = document.getElementById(`add${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Btn`);
  const saveBtn = document.getElementById('saveButton');
  const closeModalBtn = document.getElementById('closeModalButton');
  const editIdInput = document.getElementById('editId');

  async function openModal(titleKey, item = null) {
    modalTitle.textContent = t(titleKey) + ' ' + t(entityName);
    form.reset();
    editIdInput.value = '';

    if (item) {
      editIdInput.value = item.id;
      formFields.forEach(field => {
        document.getElementById(field.id).value = item[field.key];
      });
    }
    modal.classList.remove('hidden');
    applyTranslations();
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  async function handleSave() {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const itemData = {};
    formFields.forEach(field => {
      const input = document.getElementById(field.id);
      const value = input.type === 'number' ? parseInt(input.value, 10) : input.value;
      itemData[field.key] = sanitize(String(value).trim());
    });

    if (validateFn && !validateFn(itemData)) {
      return; // Validation failed, message should be shown by validateFn
    }

    const editId = editIdInput.value;
    const tableName = `${entityName}s`; // e.g., 'employees'
    let query;

    if (editId) {
      // Update existing item
      query = supabase.from(tableName).update(itemData).eq('id', editId);
    } else {
      // Create new item
      query = supabase.from(tableName).insert([itemData]);
    }

    const { data: result, error } = await query.select().single();

    if (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
      return;
    }

    addAudit(editId ? 'update' : 'create', entityName, result.id);
    closeModal();
    await renderFn();
  }

  // Initial setup & Event Listeners
  if (populateFn) await populateFn();
  addBtn?.addEventListener('click', () => openModal('add', null));
  closeModalBtn?.addEventListener('click', closeModal);
  saveBtn?.addEventListener('click', handleSave);
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    // Debounce search input slightly to avoid too many requests
    setTimeout(() => renderFn(e.target.value), 300);
  });
  document.getElementById('export')?.addEventListener('click', () => exportCSV(`${entityName}s`));
  document.getElementById('print')?.addEventListener('click', () => window.print());

  await renderFn();

  // Return action handlers so they can be used in the table renderer
  return {
    edit: async (id) => {
      const { data: item, error } = await supabase.from(`${entityName}s`).select().eq('id', id).single();
      if (error) { console.error('Error fetching item to edit:', error); return; }
      await openModal('edit', item);
    },
    del: async (id) => {
      if (confirm(t('confirmDelete'))) {
        const { error } = await supabase.from(`${entityName}s`).delete().eq('id', id);
        if (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item.');
        } else {
          addAudit('delete', entityName, id);
          await renderFn();
        }
      }
    },
  };
}