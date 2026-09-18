;;; ============================================================
;;;  2BHK RESIDENTIAL FLOOR PLAN — AutoLISP Generator
;;;  Building: 30'-0" x 40'-0"  |  Units: Feet & Inches
;;;  External Wall: 9" (0.75')  |  Internal Wall: 4.5" (0.375')
;;;  30' side = East-West  |  40' side = North-South
;;;  North = Upward
;;; ============================================================
;;;  Usage:  (load "2BHK_FloorPlan.lsp")  then type  2BHK
;;; ============================================================

(defun c:2BHK ( / )
  (princ "\n========================================")
  (princ "\n  2BHK RESIDENTIAL FLOOR PLAN GENERATOR")
  (princ "\n  Building: 30'-0\" x 40'-0\"")
  (princ "\n========================================")
  (princ "\nSetting up drawing...")

  ;; ── System Variables ──
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  (setvar "BLIPMODE" 0)

  ;; ── Create Layers ──
  (create-layer "A-WALL-EXT"   7  "Continuous" 0.50)
  (create-layer "A-WALL-INT"   8  "Continuous" 0.30)
  (create-layer "A-DOOR"       1  "Continuous" 0.18)
  (create-layer "A-WINDOW"     5  "Continuous" 0.18)
  (create-layer "A-TEXT"       7  "Continuous" 0.13)
  (create-layer "A-DIMS"       3  "Continuous" 0.13)
  (create-layer "A-FURNITURE"  8  "Continuous" 0.09)
  (create-layer "A-NORTH"      7  "Continuous" 0.18)

  ;; ── Constants ──
  (setq EW 0.75)      ; External wall thickness (9")
  (setq IW 0.375)     ; Internal wall thickness (4.5")
  (setq BW 30.0)      ; Building width
  (setq BH 40.0)      ; Building height

  ;; ── Draw Components ──
  (princ "\nDrawing external walls...")
  (draw-external-walls)

  (princ "\nDrawing internal walls...")
  (draw-internal-walls)

  (princ "\nDrawing doors...")
  (draw-doors)

  (princ "\nDrawing windows...")
  (draw-windows)

  (princ "\nAdding room labels...")
  (draw-room-labels)

  (princ "\nAdding dimensions...")
  (draw-dimensions)

  (princ "\nAdding furniture...")
  (draw-furniture)

  (princ "\nAdding north arrow...")
  (draw-north-arrow)

  ;; ── Finalize ──
  (command "ZOOM" "E")
  (setvar "CMDECHO" 1)

  (princ "\n========================================")
  (princ "\n  DRAWING COMPLETE!")
  (princ "\n  Total Rooms: 8")
  (princ "\n  Layers: 8")
  (princ "\n  Building: 30'-0\" x 40'-0\"")
  (princ "\n========================================")
  (princ)
)

;;; ============================================================
;;;  HELPER: Create Layer
;;; ============================================================
(defun create-layer (name color ltype lw / )
  (if (not (tblsearch "LAYER" name))
    (progn
      (command "-LAYER" "M" name "C" (itoa color) "" "L" ltype "" "LW" (rtos lw 2 2) "" "")
    )
    (command "-LAYER" "S" name "")
  )
)

;;; ============================================================
;;;  HELPER: Draw a filled wall rectangle
;;; ============================================================
(defun draw-wall-rect (x1 y1 x2 y2 layer / )
  (setvar "CLAYER" layer)
  (command "RECTANGLE" (list x1 y1) (list x2 y2))
)

;;; ============================================================
;;;  EXTERNAL WALLS
;;; ============================================================
(defun draw-external-walls ( / )
  (setvar "CLAYER" "A-WALL-EXT")

  ;; Outer boundary
  (command "RECTANGLE" (list 0 0) (list BW BH))

  ;; Inner boundary
  (command "RECTANGLE" (list EW EW) (list (- BW EW) (- BH EW)))

  ;; Hatch external walls
  (command "-HATCH" "P" "ANSI31" "0.25" "45" "S" "W"
    (list 0 0) (list BW 0) (list BW EW) (list 0 EW) "" "")
  (command "-HATCH" "P" "ANSI31" "0.25" "45" "S" "W"
    (list 0 (- BH EW)) (list BW (- BH EW)) (list BW BH) (list 0 BH) "" "")
  (command "-HATCH" "P" "ANSI31" "0.25" "45" "S" "W"
    (list 0 EW) (list EW (- BH EW)) "" "")
  (command "-HATCH" "P" "ANSI31" "0.25" "45" "S" "W"
    (list (- BW EW) EW) (list (- BW 0) (- BH EW)) "" "")
)

;;; ============================================================
;;;  INTERNAL WALLS
;;; ============================================================
(defun draw-internal-walls ( / )
  (setvar "CLAYER" "A-WALL-INT")

  ;; Living / Dining partition (vertical at X=12.75 to 13.125)
  (draw-wall-rect 12.75 0.75 13.125 15.75 "A-WALL-INT")

  ;; Dining north wall (horizontal at Y=10.75 to 11.125)
  (draw-wall-rect 13.125 10.75 29.25 11.125 "A-WALL-INT")

  ;; Kitchen west wall (vertical at X=20.0625 to 20.4375)
  (draw-wall-rect 20.0625 11.125 20.4375 21.125 "A-WALL-INT")

  ;; Living / Master partition (horizontal at Y=15.75 to 16.125)
  (draw-wall-rect 0.75 15.75 12.75 16.125 "A-WALL-INT")

  ;; Master east wall (vertical at X=12.75 to 13.125)
  (draw-wall-rect 12.75 16.125 13.125 27.125 "A-WALL-INT")

  ;; Toilet column left wall (vertical at X=12.75 to 13.125)
  (draw-wall-rect 12.75 11.125 13.125 27.125 "A-WALL-INT")

  ;; CT east wall (vertical at X=18.125 to 18.5)
  (draw-wall-rect 18.125 11.125 18.5 18.125 "A-WALL-INT")

  ;; AT east wall (vertical at X=18.125 to 18.5)
  (draw-wall-rect 18.125 20.125 18.5 27.125 "A-WALL-INT")

  ;; CT south wall (horizontal at Y=11.125 to 11.5)
  (draw-wall-rect 13.125 11.125 18.125 11.5 "A-WALL-INT")

  ;; CT north wall (horizontal at Y=18.125 to 18.5)
  (draw-wall-rect 13.125 18.125 18.125 18.5 "A-WALL-INT")

  ;; AT south wall (horizontal at Y=19.75 to 20.125)
  (draw-wall-rect 13.125 19.75 18.125 20.125 "A-WALL-INT")

  ;; AT north wall (horizontal at Y=27.125 to 27.5)
  (draw-wall-rect 13.125 27.125 18.125 27.5 "A-WALL-INT")

  ;; Utility south wall (horizontal at Y=27.5 to 27.875)
  (draw-wall-rect 13.125 27.5 18.125 27.875 "A-WALL-INT")

  ;; Utility east wall (vertical at X=18.125 to 18.5)
  (draw-wall-rect 18.125 27.5 18.5 35.5 "A-WALL-INT")

  ;; Utility north wall (horizontal at Y=35.5 to 35.875)
  (draw-wall-rect 13.125 35.5 18.125 35.875 "A-WALL-INT")

  ;; Bedroom 2 west wall (vertical at X=18.3125 to 18.6875)
  (draw-wall-rect 18.3125 28.25 18.6875 39.25 "A-WALL-INT")

  ;; Bedroom 2 south wall (horizontal at Y=28.25 to 28.625)
  (draw-wall-rect 18.5 28.25 28.5 28.625 "A-WALL-INT")

  ;; Bedroom 2 east wall (vertical at X=28.5 to 28.875)
  (draw-wall-rect 28.5 28.25 28.875 39.25 "A-WALL-INT")

  ;; Kitchen to Bed2 vertical wall
  (draw-wall-rect 20.0625 21.125 20.4375 28.25 "A-WALL-INT")

  ;; Lobby division wall
  (draw-wall-rect 23.125 0.75 23.5 10.75 "A-WALL-INT")

  ;; Lobby south edge
  (draw-wall-rect 20.25 10.75 23.125 11.125 "A-WALL-INT")
)

;;; ============================================================
;;;  DOORS
;;; ============================================================
(defun draw-doors ( / )
  (setvar "CLAYER" "A-DOOR")

  ;; Main Entrance — 4'-0" on south wall of Living Room
  (draw-door-h 4.5 0.75 4.0 1)

  ;; Living to Dining — 3'-0" in partition wall
  (draw-door-v 12.9375 6.5 3.0 1)

  ;; Dining to Kitchen — 3'-0" in north wall of Dining
  (draw-door-h 21.5 10.9375 3.0 1)

  ;; Living to Master — 3'-0" in partition wall
  (draw-door-h 5.0 15.9375 3.0 1)

  ;; Master to Attached Toilet — 2'-6" in east wall of Master
  (draw-door-v 12.9375 22.0 2.5 1)

  ;; To Common Toilet — 2'-6" in west wall
  (draw-door-v 13.125 14.5 2.5 -1)

  ;; Utility access — 3'-0" in south wall
  (draw-door-h 15.0 27.6875 3.0 -1)

  ;; To Bedroom 2 — 3'-0" in west wall
  (draw-door-v 18.5 32.0 3.0 -1)

  ;; CT to AT — 2'-6" internal
  (draw-door-h 15.0 19.9375 2.5 1)
)

;;; Draw horizontal door (wall runs E-W)
;;; cx, cy = center of opening, w = width, dir = swing direction
(defun draw-door-h (cx cy w dir / half x1 x2 leaf-end)
  (setq half (/ w 2.0))
  (setq x1 (- cx half))
  (setq x2 (+ cx half))

  ;; Clear wall opening (white line to mask wall)
  (command "LINE" (list x1 cy) (list x2 cy) "")

  ;; Door leaf
  (if (> dir 0)
    (progn
      (setq leaf-end (list x1 (+ cy w)))
      (command "LINE" (list x1 cy) leaf-end "")
      ;; Swing arc
      (command "ARC" "C" (list x1 cy) leaf-end (list x2 cy))
    )
    (progn
      (setq leaf-end (list x2 (- cy w)))
      (command "LINE" (list x2 cy) leaf-end "")
      ;; Swing arc
      (command "ARC" "C" (list x2 cy) leaf-end (list x1 cy))
    )
  )
)

;;; Draw vertical door (wall runs N-S)
(defun draw-door-v (cx cy w dir / half y1 y2 leaf-end)
  (setq half (/ w 2.0))
  (setq y1 (- cy half))
  (setq y2 (+ cy half))

  ;; Clear wall opening
  (command "LINE" (list cx y1) (list cx y2) "")

  ;; Door leaf
  (if (> dir 0)
    (progn
      (setq leaf-end (list (- cx w) y1))
      (command "LINE" (list cx y1) leaf-end "")
      ;; Swing arc
      (command "ARC" "C" (list cx y1) leaf-end (list cx y2))
    )
    (progn
      (setq leaf-end (list (+ cx w) y2))
      (command "LINE" (list cx y2) leaf-end "")
      ;; Swing arc
      (command "ARC" "C" (list cx y2) leaf-end (list cx y1))
    )
  )
)

;;; ============================================================
;;;  WINDOWS
;;; ============================================================
(defun draw-windows ( / )
  (setvar "CLAYER" "A-WINDOW")

  ;; Living Room — south wall
  (draw-window-h 3.0 0.75 4.0)
  ;; Living Room — west wall
  (draw-window-v 0.75 8.0 4.0)
  ;; Dining — south wall
  (draw-window-h 18.0 0.75 4.0)
  ;; Kitchen — east wall
  (draw-window-v 29.25 16.0 4.0)
  ;; Master BR — west wall
  (draw-window-v 0.75 22.0 4.0)
  ;; Master BR — north wall
  (draw-window-h 7.0 27.125 4.0)
  ;; Bedroom 2 — north wall
  (draw-window-h 24.0 39.25 4.0)
  ;; Bedroom 2 — east wall
  (draw-window-v 28.5 34.0 4.0)

  ;; Ventilators
  (setvar "CLAYER" "A-WINDOW")
  ;; CT ventilator
  (draw-window-h 15.625 18.125 2.0)
  ;; AT ventilator
  (draw-window-h 15.625 27.125 2.0)
  ;; Utility ventilator
  (draw-window-h 15.625 35.5 2.0)
)

;;; Draw horizontal window (wall runs E-W)
(defun draw-window-h (cx cy w / half x1 x2)
  (setq half (/ w 2.0))
  (setq x1 (- cx half))
  (setq x2 (+ cx half))
  ;; Three-line window symbol
  (command "LINE" (list x1 (- cy 0.1)) (list x2 (- cy 0.1)) "")
  (command "LINE" (list x1 cy) (list x2 cy) "")
  (command "LINE" (list x1 (+ cy 0.1)) (list x2 (+ cy 0.1)) "")
)

;;; Draw vertical window (wall runs N-S)
(defun draw-window-v (cx cy w / half y1 y2)
  (setq half (/ w 2.0))
  (setq y1 (- cy half))
  (setq y2 (+ cy half))
  ;; Three-line window symbol
  (command "LINE" (list (- cx 0.1) y1) (list (- cx 0.1) y2) "")
  (command "LINE" (list cx y1) (list cx y2) "")
  (command "LINE" (list (+ cx 0.1) y1) (list (+ cx 0.1) y2) "")
)

;;; ============================================================
;;;  ROOM LABELS
;;; ============================================================
(defun draw-room-labels ( / th)
  (setvar "CLAYER" "A-TEXT")
  (setq th 0.4)  ; Text height

  ;; Living Room
  (draw-label 6.75 8.5 "LIVING ROOM" th)
  (draw-label 6.75 7.8 "12'-0\" x 15'-0\"" (* th 0.75))

  ;; Dining
  (draw-label 18.125 6.0 "DINING" th)
  (draw-label 18.125 5.3 "10'-0\" x 10'-0\"" (* th 0.75))

  ;; Kitchen
  (draw-label 24.75 16.0 "KITCHEN" th)
  (draw-label 24.75 15.3 "9'-0\" x 10'-0\"" (* th 0.75))

  ;; Utility
  (draw-label 15.625 31.5 "UTILITY / WASH" th)
  (draw-label 15.625 30.8 "5'-0\" x 8'-0\"" (* th 0.75))

  ;; Master Bedroom
  (draw-label 6.75 21.5 "MASTER BEDROOM" th)
  (draw-label 6.75 20.8 "11'-0\" x 12'-0\"" (* th 0.75))

  ;; Common Toilet
  (draw-label 15.625 14.5 "COMMON" (* th 0.8))
  (draw-label 15.625 14.0 "TOILET" (* th 0.8))
  (draw-label 15.625 13.3 "5'-0\" x 7'-0\"" (* th 0.65))

  ;; Attached Toilet
  (draw-label 15.625 23.5 "ATTACHED" (* th 0.8))
  (draw-label 15.625 23.0 "TOILET" (* th 0.8))
  (draw-label 15.625 22.3 "5'-0\" x 7'-0\"" (* th 0.65))

  ;; Bedroom 2
  (draw-label 23.5 34.0 "BEDROOM 2" th)
  (draw-label 23.5 33.3 "10'-0\" x 11'-0\"" (* th 0.75))

  ;; Entrance label
  (setvar "CLAYER" "A-TEXT")
  (draw-label 26.0 5.0 "ENTRANCE" (* th 0.6))
  (draw-label 26.0 4.4 "LOBBY" (* th 0.6))
)

(defun draw-label (x y txt th / )
  (setvar "CLAYER" "A-TEXT")
  (command "TEXT" "M" (list x y) th "0" txt)
)

;;; ============================================================
;;;  DIMENSIONS
;;; ============================================================
(defun draw-dimensions ( / )
  (setvar "CLAYER" "A-DIMS")

  ;; Set up dimension style
  (command "DIMSTYLE" "S" "Architectural" "")
  (command "DIM" "DIMTXT" "0.35" "DIMASZ" "0.25" "DIMEXO" "0.15"
           "DIMEXE" "0.1" "DIMDEC" "0" "DIMFRAC" "1"
           "DIMUNIT" "4" "LUNIT" "4" "EXIT")

  ;; Overall width (bottom)
  (command "DIMALIGNED" (list 0 -3) (list BW -3) (list (/ BW 2.0) -4.5))

  ;; Overall height (left)
  (command "DIMALIGNED" (list -3 0) (list -3 BH) (list -4.5 (/ BH 2.0)))

  ;; Room widths (bottom)
  (command "DIMALIGNED" (list 0.75 -1.5) (list 12.75 -1.5) (list 6.75 -2.5))
  (command "DIMALIGNED" (list 13.125 -1.5) (list 23.125 -1.5) (list 18.125 -2.5))

  ;; Room heights (left)
  (command "DIMALIGNED" (list -1.5 0.75) (list -1.5 15.75) (list -2.5 8.25))
  (command "DIMALIGNED" (list -1.5 16.125) (list -1.5 27.125) (list -2.5 21.625))

  ;; Top width
  (command "DIMALIGNED" (list 18.5 (+ BH 1.5)) (list 28.5 (+ BH 1.5)) (list 23.5 (+ BH 2.5)))

  ;; Right height
  (command "DIMALIGNED" (list (+ BW 1.5) 28.25) (list (+ BW 1.5) 39.25) (list (+ BW 2.5) 33.75))

  ;; Kitchen width
  (command "DIMALIGNED" (list 20.25 10.0) (list 29.25 10.0) (list 24.75 9.0))

  ;; Wall thickness note
  (setvar "CLAYER" "A-DIMS")
  (command "TEXT" "M" (list (/ BW 2.0) -6) 0.25 "0"
    "EXT. WALL = 9\" (230mm) | INT. PARTITION = 4 1/2\" (115mm)")
)

;;; ============================================================
;;;  FURNITURE
;;; ============================================================
(defun draw-furniture ( / )
  (setvar "CLAYER" "A-FURNITURE")

  ;; ── Living Room: Sofa ──
  (command "RECTANGLE" (list 1.5 12) (list 8.5 14))
  (command "LINE" (list 1.5 13.5) (list 8.5 13.5) "")
  ;; TV Unit
  (command "RECTANGLE" (list 4 1.25) (list 8 1.75))

  ;; ── Dining: Table + Chairs ──
  (command "RECTANGLE" (list 15.5 4.5) (list 20.5 7.5))
  ;; Chairs (circles)
  (command "CIRCLE" (list 16.5 8.2) 0.35)
  (command "CIRCLE" (list 18.0 8.2) 0.35)
  (command "CIRCLE" (list 19.5 8.2) 0.35)
  (command "CIRCLE" (list 16.5 3.8) 0.35)
  (command "CIRCLE" (list 18.0 3.8) 0.35)
  (command "CIRCLE" (list 19.5 3.8) 0.35)
  (command "CIRCLE" (list 15.0 6.0) 0.35)
  (command "CIRCLE" (list 21.0 6.0) 0.35)

  ;; ── Kitchen: L-Counter ──
  (command "RECTANGLE" (list 20.75 11.625) (list 21.75 19.625))
  (command "RECTANGLE" (list 21.75 11.625) (list 27.25 12.625))
  ;; Sink
  (command "RECTANGLE" (list 21 16) (list 21.5 17.5))
  ;; Stove burners
  (command "CIRCLE" (list 24 12.1) 0.35)
  (command "CIRCLE" (list 25.5 12.1) 0.35)

  ;; ── Master Bedroom: Double Bed ──
  (command "RECTANGLE" (list 2 18.5) (list 7 24.5))
  ;; Pillows
  (command "RECTANGLE" (list 2.3 24) (list 4.2 24.8))
  (command "RECTANGLE" (list 4.8 24) (list 6.7 24.8))
  ;; Blanket line
  (command "LINE" (list 2.3 21.5) (list 6.7 21.5) "")

  ;; ── Bedroom 2: Single Bed ──
  (command "RECTANGLE" (list 20 30.5) (list 24.5 36.5))
  ;; Pillow
  (command "RECTANGLE" (list 20.3 35.8) (list 24.2 36.6))
  ;; Blanket line
  (command "LINE" (list 20.3 33) (list 24.2 33) "")

  ;; ── Common Toilet: WC + Basin ──
  ;; WC (oval approximation)
  (command "ELLIPSE" "C" (list 14.5 13.5) (list 0.5 0) 0.7)
  ;; Tank
  (command "RECTANGLE" (list 14.1 14.5) (list 14.9 15))
  ;; Basin
  (command "ELLIPSE" "C" (list 16.8 14) (list 0.4 0) 0.35)

  ;; ── Attached Toilet: WC + Basin ──
  (command "ELLIPSE" "C" (list 14.5 22.5) (list 0.5 0) 0.7)
  (command "RECTANGLE" (list 14.1 23.5) (list 14.9 24))
  (command "ELLIPSE" "C" (list 16.8 23) (list 0.4 0) 0.35)

  ;; ── Utility: Basin ──
  (command "RECTANGLE" (list 14 33) (list 16 34.2))
  (command "ELLIPSE" "C" (list 15 32.5) (list 0.4 0) 0.3)
)

;;; ============================================================
;;;  NORTH ARROW
;;; ============================================================
(defun draw-north-arrow ( / cx cy r)
  (setvar "CLAYER" "A-NORTH")
  (setq cx 33.0)
  (setq cy 37.0)
  (setq r 1.0)

  ;; Circle
  (command "CIRCLE" (list cx cy) r)

  ;; Arrow body (filled triangle)
  (command "SOLID"
    (list cx (+ cy r))
    (list (- cx 0.3) (- cy 0.2))
    (list (+ cx 0.3) (- cy 0.2))
    ""
  )

  ;; Tail line
  (command "LINE" (list cx (- cy 0.2)) (list cx (- cy r)) "")

  ;; "N" label
  (command "TEXT" "M" (list cx (+ cy r 0.6)) 0.5 "0" "N")
  (command "TEXT" "M" (list cx (- cy r 0.5)) 0.25 "0" "NORTH")
)

;;; ============================================================
;;;  LOAD MESSAGE
;;; ============================================================
(princ "\n")
(princ "========================================\n")
(princ "  2BHK Floor Plan Generator Loaded!\n")
(princ "  Type  2BHK  to generate the drawing\n")
(princ "========================================\n")
(princ)
