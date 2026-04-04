export const admins = {
  en: {
    title: 'Admins',
    version: 'Auth V1.0',
    addAdmin: 'Add Admin',
    emailPlaceholder: 'Enter google email...',
    adding: 'Adding...',
    adminList: 'Access Registry',
    table: {
      email: 'Email',
      addedAt: 'Access Granted',
      role: 'Role',
      actions: 'Actions'
    },
    roles: {
      root: 'Root',
      admin: 'Admin'
    },
    actions: {
      revoke: 'Revoke',
      revoking: 'Revoking...',
      rootProtected: 'Protected'
    },
    alerts: {
      successAdded: 'Successfully registered new admin.',
      successRevoked: 'Admin access permanently revoked.',
      errorAdd: 'Failed to add admin.',
      errorRevoke: 'Failed to revoke access.',
      errorInvalidEmail: 'Please provide a valid email.',
      errorDuplicate: 'Admin is already registered.',
      errorRootRevoke: 'Cannot revoke root administrator.'
    }
  },
  ar: {
    title: 'المدراء',
    version: 'أمان ١.٠',
    addAdmin: 'إضافة مدير',
    emailPlaceholder: 'أدخل إيميل جوجل...',
    adding: 'جاري الإضافة...',
    adminList: 'سجل الصلاحيات',
    table: {
      email: 'الإيميل',
      addedAt: 'وقت المنح',
      role: 'الصلاحية',
      actions: 'إجراءات'
    },
    roles: {
      root: 'جذري',
      admin: 'مدير'
    },
    actions: {
      revoke: 'طرد',
      revoking: 'جاري الطرد...',
      rootProtected: 'محمي'
    },
    alerts: {
      successAdded: 'تم تسجيل المدير بنجاح.',
      successRevoked: 'تم إرجاع صلاحيات المدير وطردُه نهائياً.',
      errorAdd: 'فشل في إضافة المدير.',
      errorRevoke: 'فشل في طرد المدير.',
      errorInvalidEmail: 'يرجى إدخال إيميل صحيح.',
      errorDuplicate: 'الإيميل ده مسجل مدير بالفعل.',
      errorRootRevoke: 'لا يمكن طرد المدير الجذري (Root).'
    }
  }
};
