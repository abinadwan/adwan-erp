document.addEventListener('DOMContentLoaded', async () => {
  const session = requireSession();
  if (!session) return;

  // --- Configuration for CRUD Helpers ---

  const pageConfig = {
    entityName: 'employee',
    formFields: [
      { id: 'empName', key: 'name' },
      { id: 'empEmail', key: 'email' },
      { id: 'empDept', key: 'departmentId' },
    ],
    validateFn: (itemData) => {
      if (!validateEmail(itemData.email)) {
        alert(t('invalidEmail'));
        return false;
      }
      return true;
    },
    populateFn: async () => {
      const deptSelect = document.getElementById('empDept');
      const { data: departments, error } = await supabase.from('departments').select('id, name');
      if (error) { console.error('Error fetching departments:', error); return; }
      
      departments.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        deptSelect.appendChild(opt);
      });
    }
  };

  const tableConfig = {
    tableBodyId: 'employeesBody',
    getDataSource: (filter) => {
      let query = supabase.from('employees').select(`
        id,
        name,
        email,
        departmentId,
        departments ( name )
      `);
      if (filter) {
        query = query.or(`name.ilike.%${filter}%,email.ilike.%${filter}%`);
      }
      return query;
    },
    columns: [
      { key: 'name' },
      { key: 'email' },
      {
        key: 'department', // For search purposes
        // The data is now joined in the getDataSource query
        lookup: (item) => item.departments?.name || ''
      },
    ],
    getActions: (item) => {
      const editBtn = document.createElement('button');
      editBtn.textContent = t('edit');
      editBtn.addEventListener('click', () => actions.edit(item.id));

      const delBtn = document.createElement('button');
      delBtn.textContent = t('delete');
      delBtn.addEventListener('click', () => actions.del(item.id));

      return [editBtn, delBtn];
    }
  };

  // --- Initialization ---

  const render = createTableRenderer(tableConfig);
  const actions = await initializeModalCrud({ ...pageConfig, renderFn: render });
});
