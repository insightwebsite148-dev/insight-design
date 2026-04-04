'use client';

import { useEditMode } from '@/context/EditModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  PencilOff,
  Upload,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// EDIT MODE TOGGLE — Shown in Navbar (Admin Only)
// ═══════════════════════════════════════════════════════════════════
export function EditModeToggle() {
  const { isAdmin, isEditMode, toggleEditMode, pendingChanges } = useEditMode();

  // Temporarily hidden per user request
  return null;

  return (
    <motion.button
      onClick={toggleEditMode}
      className={`
        relative flex items-center gap-2 h-10 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em]
        transition-all duration-500 border
        ${isEditMode
          ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/25'
          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600'
        }
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {isEditMode ? <PencilOff size={14} /> : <Pencil size={14} />}
      <span className="hidden md:inline">{isEditMode ? 'وضع المعاينة' : 'وضع التعديل'}</span>
      
      {/* Pending changes badge */}
      <AnimatePresence>
        {isEditMode && pendingChanges.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md"
          >
            {pendingChanges.length}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PUBLISH BAR — Floating bar to publish or discard all changes
// ═══════════════════════════════════════════════════════════════════
export function PublishBar() {
  const {
    isEditMode,
    pendingChanges,
    publishAll,
    discardAll,
    isPublishing,
    publishStatus,
  } = useEditMode();

  if (!isEditMode) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="publish-bar-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="publish-bar">
          {/* Left: Status */}
          <div className="publish-bar-left">
            <div className={`publish-bar-indicator ${pendingChanges.length > 0 ? 'has-changes' : ''}`} />
            <div className="publish-bar-info">
              <span className="publish-bar-label">
                {isEditMode ? 'وضع التعديل مفعل' : 'وضع المعاينة'}
              </span>
              <span className="publish-bar-count">
                {pendingChanges.length > 0
                  ? `${pendingChanges.length} تعديل معلق`
                  : 'لا توجد تعديلات'
                }
              </span>
            </div>
          </div>

          {/* Center: Change List Preview */}
          {pendingChanges.length > 0 && (
            <div className="publish-bar-changes">
              {pendingChanges.slice(0, 3).map((change) => (
                <div key={change.id} className="publish-bar-change-chip">
                  <span className="publish-bar-change-field">{change.field}</span>
                  <span className="publish-bar-change-type">{change.type}</span>
                </div>
              ))}
              {pendingChanges.length > 3 && (
                <span className="publish-bar-more">+{pendingChanges.length - 3} more</span>
              )}
            </div>
          )}

          {/* Right: Actions */}
          <div className="publish-bar-actions">
            {/* Status Message */}
            <AnimatePresence mode="wait">
              {publishStatus === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="publish-bar-status success"
                >
                  <Check size={14} />
                  <span>تم النشر بنجاح!</span>
                </motion.div>
              )}
              {publishStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="publish-bar-status error"
                >
                  <AlertTriangle size={14} />
                  <span>حدث خطأ أثناء النشر</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Discard */}
            {pendingChanges.length > 0 && (
              <button
                onClick={discardAll}
                className="publish-bar-btn discard"
                disabled={isPublishing}
              >
                <Trash2 size={14} />
                <span>تجاهل الكل</span>
              </button>
            )}

            {/* Publish */}
            <button
              onClick={publishAll}
              className={`publish-bar-btn publish ${pendingChanges.length === 0 ? 'disabled' : ''}`}
              disabled={isPublishing || pendingChanges.length === 0}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>جاري النشر...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
