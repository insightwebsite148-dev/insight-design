'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useEditMode } from '@/context/EditModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Save,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Palette,
  X,
  Type,
  ImageIcon,
  Check,
  RotateCcw,
} from 'lucide-react';
import { PRESET_COLORS as CONFIG_COLORS } from '@/lib/edit-config';

// ─── Types ─────────────────────────────────────────────────────────
interface EditableWrapperProps {
  children: React.ReactNode;
  /** Firestore collection (e.g. 'settings', 'projects') */
  collection: string;
  /** Firestore document ID (e.g. 'general', or project ID) */
  documentId: string;
  /** Field to update in Firestore (e.g. 'heroHeadline') */
  field: string;
  /** Current value */
  value: string;
  /** Type of content */
  type?: 'text' | 'image';
  /** Optional className for wrapper */
  className?: string;
  /** Additional styles support */
  styleField?: string;
  /** Current text alignment */
  alignment?: 'left' | 'center' | 'right';
  /** Current font size */
  fontSize?: string;
  /** Current color */
  color?: string;
  /** Optional placeholder when empty */
  placeholder?: string;
}

const COLORS = CONFIG_COLORS;

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px',
  '32px', '36px', '40px', '48px', '56px', '64px', '72px', '80px',
];

// ═══════════════════════════════════════════════════════════════════
// EDITABLE WRAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function EditableWrapper({
  children,
  collection,
  documentId,
  field,
  value,
  type = 'text',
  className = '',
  styleField,
  alignment: initialAlignment = 'left',
  fontSize: initialFontSize,
  color: initialColor,
  placeholder = 'Add content...',
}: EditableWrapperProps) {
  const { isEditMode, addChange } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [currentAlignment, setCurrentAlignment] = useState(initialAlignment);
  const [currentFontSize, setCurrentFontSize] = useState(initialFontSize || '');
  const [currentColor, setCurrentColor] = useState(initialColor || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync value from props
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
    }
  }, [value, isEditing]);

  // Auto-focus textarea on edit
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Close pickers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
        setShowSizePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isEditMode) return <>{children}</>;

  // ─── Handlers ────────────────────────────────────────────────────
  const handleSave = () => {
    if (editedValue !== value) {
      addChange({
        collection,
        documentId,
        field,
        oldValue: value,
        newValue: editedValue,
        type: type === 'image' ? 'image' : 'text',
      });
    }
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAlignmentChange = () => {
    const alignments: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const currentIndex = alignments.indexOf(currentAlignment);
    const newAlignment = alignments[(currentIndex + 1) % alignments.length];
    setCurrentAlignment(newAlignment);

    if (styleField) {
      addChange({
        collection,
        documentId,
        field: `${styleField}Alignment`,
        oldValue: currentAlignment,
        newValue: newAlignment,
        type: 'alignment',
      });
    }
  };

  const handleSizeChange = (size: string) => {
    setCurrentFontSize(size);
    setShowSizePicker(false);

    if (styleField) {
      addChange({
        collection,
        documentId,
        field: `${styleField}FontSize`,
        oldValue: currentFontSize,
        newValue: size,
        type: 'size',
      });
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setShowColorPicker(false);

    if (styleField) {
      addChange({
        collection,
        documentId,
        field: `${styleField}Color`,
        oldValue: currentColor,
        newValue: color,
        type: 'color',
      });
    }
  };

  const getAlignmentIcon = () => {
    switch (currentAlignment) {
      case 'center': return AlignCenter;
      case 'right': return AlignRight;
      default: return AlignLeft;
    }
  };

  const AlignIcon = getAlignmentIcon();

  // ─── Inline styles from changes ──────────────────────────────────
  const dynamicStyles: React.CSSProperties = {};
  if (currentAlignment) dynamicStyles.textAlign = currentAlignment;
  if (currentFontSize) dynamicStyles.fontSize = currentFontSize;
  if (currentColor) dynamicStyles.color = currentColor;

  return (
    <div
      ref={editRef}
      className={`editable-wrapper ${isHovered ? 'editable-hovered' : ''} ${isEditing ? 'editable-active' : ''} ${isSaved ? 'editable-saved' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowColorPicker(false);
        setShowSizePicker(false);
      }}
      style={{ position: 'relative', ...dynamicStyles }}
    >
      {/* ─── Editable Content ───────────────────────────────────── */}
      {isEditing ? (
        <div className="editable-input-wrapper">
          {type === 'text' ? (
            <textarea
              ref={textareaRef}
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="editable-textarea"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setEditedValue(value);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              placeholder="Enter image URL..."
              className="editable-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setEditedValue(value);
                  setIsEditing(false);
                }
              }}
            />
          )}
        </div>
      ) : (
        <div style={dynamicStyles}>
          {children || <span className="opacity-40 italic">{placeholder}</span>}
          {(!children || (typeof children === 'string' && children.trim() === '')) && (
            <span className="opacity-40 italic">{placeholder}</span>
          )}
        </div>
      )}

      {/* ─── Floating Toolbar ───────────────────────────────────── */}
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            className="editable-toolbar"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="editable-btn editable-btn-edit"
              title="تعديل"
            >
              <Pencil size={14} />
              <span>تعديل</span>
            </button>

            {/* Alignment */}
            <button
              onClick={handleAlignmentChange}
              className="editable-btn editable-btn-align"
              title="تغيير المحاذاة"
            >
              <AlignIcon size={14} />
            </button>

            {/* Size */}
            <div className="editable-btn-group">
              <button
                onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); }}
                className="editable-btn editable-btn-size"
                title="تغيير الحجم"
              >
                <Maximize2 size={14} />
              </button>
              <AnimatePresence>
                {showSizePicker && (
                  <motion.div
                    className="editable-dropdown editable-size-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {FONT_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`editable-dropdown-item ${currentFontSize === size ? 'active' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Color */}
            <div className="editable-btn-group">
              <button
                onClick={() => { setShowColorPicker(!showColorPicker); setShowSizePicker(false); }}
                className="editable-btn editable-btn-color"
                title="تغيير اللون"
              >
                <Palette size={14} />
                <span
                  className="editable-color-swatch"
                  style={{ backgroundColor: currentColor || '#121212' }}
                />
              </button>
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    className="editable-dropdown editable-color-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="editable-color-grid">
                      {COLORS.map((c: string) => (
                        <button
                          key={c}
                          onClick={() => handleColorChange(c)}
                          className={`editable-color-btn ${currentColor === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={currentColor || '#121212'}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="editable-color-custom"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Save/Cancel Bar (when editing) ────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="editable-save-bar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <button onClick={handleSave} className="editable-btn editable-btn-save">
              <Check size={14} />
              <span>حفظ</span>
            </button>
            <button
              onClick={() => {
                setEditedValue(value);
                setIsEditing(false);
              }}
              className="editable-btn editable-btn-cancel"
            >
              <X size={14} />
              <span>إلغاء</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Saved Indicator ────────────────────────────────────── */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            className="editable-saved-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Check size={14} />
            <span>تم الحفظ</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
