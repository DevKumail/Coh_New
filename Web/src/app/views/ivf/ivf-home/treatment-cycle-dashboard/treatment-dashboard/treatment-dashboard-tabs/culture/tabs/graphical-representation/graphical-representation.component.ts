import { Component, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Oocyte {
  number: number;
  id: string;
  status: 'normal' | 'discarded' | 'cryo' | 'transfer';
  spType: string;
}

interface CellData {
  oocyteId: string;
  dayIndex: number;
  spermIcon?: boolean;
  spermTooltip?: string;
  greenDot?: boolean;
  stageIcon?: boolean;
  stageTooltip?: string;
  stageColor?: string;
  innerDots?: boolean;
  redX?: boolean;
  embryoStage?: '2-cell' | '4-cell' | '8-cell' | 'morula' | 'blastocyst';
  embryoTooltip?: string;
  stageLabel?: string;
  cryoIcon?: boolean;
  degeneratedIcon?: boolean;
  transferIcon?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
  notes?: string;
}

interface SemenSample {
  id: string;
  sampleId: string;
  type: 'Fresh' | 'Frozen' | 'Donor';
  collectionDate: Date;
  volume: number;
  concentration: number;
  motility: number;
  morphology: number;
  notes?: string;
}

@Component({
  selector: 'app-graphical-representation',
  imports: [CommonModule],
  templateUrl: './graphical-representation.component.html',
  styleUrl: './graphical-representation.component.scss'
})
export class GraphicalRepresentationComponent {
  @ViewChild('cellDetailsModal') cellDetailsModal!: TemplateRef<any>;
  @ViewChild('semenModal') semenModal!: TemplateRef<any>;

  // Days array - dynamically generated
  days: Date[] = [];
  
  // Oocytes data - this will be dynamic from API
  oocytes: Oocyte[] = [
    { number: 1, id: '7606', status: 'normal', spType: 'I' },
    { number: 2, id: '7607', status: 'normal', spType: 'I' },
    { number: 3, id: '7608', status: 'normal', spType: 'I' },
    { number: 4, id: '7609', status: 'discarded', spType: 'I' },
    { number: 5, id: '7610', status: 'normal', spType: 'I' },
    { number: 6, id: '9100', status: 'normal', spType: 'I' },
    { number: 7, id: '9101', status: 'normal', spType: 'I' },
    { number: 8, id: '9102', status: 'discarded', spType: 'I' },
  ];

  // Cell data storage - maps oocyteId + dayIndex to cell data
  private cellDataMap: Map<string, CellData> = new Map();

  // Context menu state
  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  activeSubmenu: string | null = null;
  activeNestedSubmenu: string | null = null;
  private contextMenuCellElement: HTMLElement | null = null;
  
  // Selected cell tracking
  selectedCell: { oocyteId: string; dayIndex: number } | null = null;
  selectedOocyte: Oocyte | null = null;
  selectedCellDetails: any = null;
  
  // Semen analysis data
  selectedOocyteForSemen: Oocyte | null = null;
  selectedSemenSample: SemenSample | null = null;
  semenSamples: SemenSample[] = [];

  constructor(private modalService: NgbModal) {
    this.initializeDays();
    this.initializeSampleData();
    this.initializeSemenSamples();
  }

  // Initialize days (Day 0 to Day 8)
  initializeDays() {
    const startDate = new Date('2025-06-22');
    for (let i = 0; i < 9; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      this.days.push(day);
    }
  }

  // Initialize sample cell data based on images
  initializeSampleData() {
    // Oocyte 1 (7606)
    this.setCellData('7606', 0, {
      spermIcon: true,
      spermTooltip: 'ICSI performed',
      stageIcon: false,
      embryoStage: undefined
    });
    this.setCellData('7606', 1, {
      greenDot: true,
      stageIcon: true,
      stageTooltip: '1 PN observed',
      stageColor: '#666',
      innerDots: true
    });
    this.setCellData('7606', 2, {
      embryoStage: '2-cell',
      embryoTooltip: '2-cell stage',
      stageLabel: '2',
      cryoIcon: true
    });

    // Oocyte 2 (7607)
    this.setCellData('7607', 0, {
      spermIcon: true,
      spermTooltip: 'ICSI performed'
    });
    this.setCellData('7607', 1, {
      greenDot: true,
      stageIcon: true,
      stageTooltip: '1 PN observed',
      innerDots: true
    });
    this.setCellData('7607', 2, {
      embryoStage: '2-cell',
      stageLabel: '2',
      cryoIcon: true
    });

    // Oocyte 3 (7608)
    this.setCellData('7608', 0, {
      spermIcon: true,
      spermTooltip: 'ICSI performed'
    });
    this.setCellData('7608', 1, {
      greenDot: true,
      stageIcon: true,
      stageTooltip: '1 PN observed',
      innerDots: true
    });
    this.setCellData('7608', 2, {
      stageLabel: '1,2'
    });

    // Oocyte 4 (7609) - Discarded
    this.setCellData('7609', 0, {
      spermIcon: true,
      spermTooltip: 'ICSI performed'
    });
    this.setCellData('7609', 1, {
      stageIcon: true,
      redX: true,
      stageTooltip: 'Degenerated'
    });

    // Oocyte 5 (7610)
    this.setCellData('7610', 0, {
      spermIcon: true,
      spermTooltip: 'ICSI performed'
    });
    this.setCellData('7610', 1, {
      greenDot: true,
      stageIcon: true,
      innerDots: true
    });
    this.setCellData('7610', 2, {
      stageLabel: '1',
      cryoIcon: true
    });
  }

  // Set cell data
  setCellData(oocyteId: string, dayIndex: number, data: Partial<CellData>) {
    const key = `${oocyteId}-${dayIndex}`;
    const existing = this.cellDataMap.get(key) || { oocyteId, dayIndex };
    this.cellDataMap.set(key, { ...existing, ...data });
  }

  // Get cell data
  getCellData(oocyteId: string, dayIndex: number): CellData | null {
    const key = `${oocyteId}-${dayIndex}`;
    return this.cellDataMap.get(key) || null;
  }

  // Check if cell is enabled (Day 0 always enabled, next day enabled when previous is marked)
  isCellEnabled(oocyte: Oocyte, dayIndex: number): boolean {
    if (dayIndex === 0) return true;
    
    // Check if previous day has data
    const prevKey = `${oocyte.id}-${dayIndex - 1}`;
    return this.cellDataMap.has(prevKey);
  }

  // Right click handler
  onRightClick(event: MouseEvent, oocyte: Oocyte, dayIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.isCellEnabled(oocyte, dayIndex)) {
      return;
    }

    this.selectedCell = { oocyteId: oocyte.id, dayIndex };
    this.selectedOocyte = oocyte;
    
    // Store the cell element reference
    this.contextMenuCellElement = event.currentTarget as HTMLElement;
    
    // Update menu position
    this.updateContextMenuPosition();
    
    this.showContextMenu = true;
    this.activeSubmenu = null;
  }

  // Update context menu position based on cell element
  private updateContextMenuPosition() {
    if (!this.contextMenuCellElement) return;
    
    const rect = this.contextMenuCellElement.getBoundingClientRect();
    
    // Position menu relative to the cell
    // Try to show menu to the right of the cell, if not enough space show to the left
    const menuWidth = 280; // increased menu width
    const menuHeight = 500; // increased menu height with scroll
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate X position (prefer right side of cell)
    let x = rect.right + 5; // 5px gap from cell
    if (x + menuWidth > viewportWidth) {
      // Not enough space on right, show on left
      x = rect.left - menuWidth - 5;
    }
    // If still not enough space, align with viewport
    if (x < 0) {
      x = 10;
    }
    
    // Calculate Y position (align with top of cell)
    let y = rect.top;
    if (y + menuHeight > viewportHeight) {
      // Not enough space below, align to bottom
      y = viewportHeight - menuHeight - 10;
    }
    if (y < 0) {
      y = 10;
    }
    
    this.contextMenuX = x;
    this.contextMenuY = y;
  }

  // Double click handler
  onDoubleClick(oocyte: Oocyte, dayIndex: number) {
    if (!this.isCellEnabled(oocyte, dayIndex)) {
      return;
    }

    const cellData = this.getCellData(oocyte.id, dayIndex);
    
    this.selectedCellDetails = {
      oocyteNumber: oocyte.number,
      oocyteId: oocyte.id,
      day: dayIndex,
      imageUrl: cellData?.imageUrl || 'assets/images/embryo-sample.jpg',
      notes: cellData?.notes || ''
    };

    this.modalService.open(this.cellDetailsModal, { size: 'lg', centered: true });
  }

  // Context menu item selection
  selectMenuItem(item: string) {
    if (item === 'ooc-treatment' || item === 'stage' || item === 'ooc-groups' || item === 'quality') {
      this.activeSubmenu = this.activeSubmenu === item ? null : item;
      console.log('Active submenu:', this.activeSubmenu); // Debug log
      return;
    }

    if (item === 'discarded' && this.selectedCell) {
      this.updateCellStatus('discarded');
    } else if (item === 'cryopreservation' && this.selectedCell) {
      this.updateCellStatus('cryo');
    } else if (item === 'transfer' && this.selectedCell) {
      this.updateCellStatus('transfer');
    } else if (item === 'arrested' && this.selectedCell) {
      this.updateCellStatus('arrested');
    } else if (item === 'cultivation' && this.selectedCell) {
      this.updateCellStatus('cultivation');
    }

    this.closeContextMenu();
  }

  // Select nested submenu (for PN and x-cells)
  selectNestedSubmenu(item: string) {
    this.activeNestedSubmenu = this.activeNestedSubmenu === item ? null : item;
    console.log('Active nested submenu:', this.activeNestedSubmenu);
  }

  // Select treatment
  selectTreatment(treatment: string) {
    console.log('Treatment selected:', treatment);
    if (this.selectedCell) {
      const { oocyteId, dayIndex } = this.selectedCell;
      if (treatment === 'ICSI') {
        this.setCellData(oocyteId, dayIndex, {
          spermIcon: true,
          spermTooltip: 'ICSI performed'
        });
      }
    }
    this.closeContextMenu();
  }

  // Select stage
  selectStage(stage: string) {
    console.log('Stage selected:', stage);
    if (this.selectedCell) {
      const { oocyteId, dayIndex } = this.selectedCell;
      
      if (stage === '0PN' || stage === '1PN' || stage === '2PN' || stage === '3PN' || stage === '4PN') {
        const pnCount = stage.replace('PN', '');
        this.setCellData(oocyteId, dayIndex, {
          greenDot: pnCount === '2', // Green dot only for normal 2PN
          stageLabel: pnCount + 'PN'
        });
      } else if (stage === '1-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '2-cell', // Use 2-cell SVG but show 1
          stageLabel: '1'
        });
      } else if (stage === '2-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '2-cell',
          stageLabel: '2'
        });
      } else if (stage === '3-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '4-cell', // Use 4-cell pattern
          stageLabel: '3'
        });
      } else if (stage === '4-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '4-cell',
          stageLabel: '4'
        });
      } else if (stage === '5-cell' || stage === '6-cell' || stage === '7-cell') {
        const cellCount = stage.replace('-cell', '');
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '8-cell', // Use 8-cell pattern
          stageLabel: cellCount
        });
      } else if (stage === '8-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: '8-cell',
          stageLabel: '8'
        });
      } else if (stage === '9-16-cell') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: 'morula', // Use morula pattern for 9-16
          stageLabel: '9-16'
        });
      } else if (stage === 'Morula') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: 'morula',
          stageLabel: 'M'
        });
      } else if (stage === 'Blastocyst' || stage === 'Early blastocyst' || stage === 'Expanded blastocyst') {
        this.setCellData(oocyteId, dayIndex, {
          embryoStage: 'blastocyst',
          stageLabel: 'B'
        });
      } else if (stage === 'Degenerated') {
        this.setCellData(oocyteId, dayIndex, {
          degeneratedIcon: true
        });
      } else if (stage === 'MII') {
        this.setCellData(oocyteId, dayIndex, {
          greenDot: true,
          stageLabel: 'MII'
        });
      } else {
        // For other stages, just show the label
        this.setCellData(oocyteId, dayIndex, {
          stageLabel: stage
        });
      }
    }
    this.closeContextMenu();
  }

  // Select quality/grade
  selectQuality(quality: string) {
    console.log('Quality selected:', quality);
    if (this.selectedCell) {
      const { oocyteId, dayIndex } = this.selectedCell;
      this.setCellData(oocyteId, dayIndex, {
        stageLabel: quality
      });
    }
    this.closeContextMenu();
  }

  // Select ooc group
  selectOocGroup(group: string) {
    console.log('Ooc group selected:', group);
    this.closeContextMenu();
  }

  // Update cell status
  updateCellStatus(status: 'discarded' | 'cryo' | 'transfer' | 'arrested' | 'cultivation') {
    if (!this.selectedCell || !this.selectedOocyte) return;

    const { oocyteId, dayIndex } = this.selectedCell;
    
    if (status === 'discarded') {
      this.setCellData(oocyteId, dayIndex, {
        degeneratedIcon: true,
        redX: true
      });
      this.selectedOocyte.status = 'discarded';
    } else if (status === 'cryo') {
      this.setCellData(oocyteId, dayIndex, {
        cryoIcon: true
      });
      this.selectedOocyte.status = 'cryo';
    } else if (status === 'transfer') {
      this.setCellData(oocyteId, dayIndex, {
        transferIcon: true
      });
      this.selectedOocyte.status = 'transfer';
    } else if (status === 'arrested') {
      this.setCellData(oocyteId, dayIndex, {
        degeneratedIcon: true
      });
    } else if (status === 'cultivation') {
      this.setCellData(oocyteId, dayIndex, {
        greenDot: true
      });
    }
  }

  // Close context menu
  closeContextMenu() {
    this.showContextMenu = false;
    this.activeSubmenu = null;
    this.activeNestedSubmenu = null;
    this.contextMenuCellElement = null;
    this.selectedCell = null; // Clear cell selection when menu closes
  }

  // Listen for clicks outside context menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.closeContextMenu();
  }

  // Listen for scroll events to update menu position
  @HostListener('window:scroll', ['$event'])
  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.showContextMenu && this.contextMenuCellElement) {
      this.updateContextMenuPosition();
    }
  }

  // Listen for resize events to update menu position
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.showContextMenu && this.contextMenuCellElement) {
      this.updateContextMenuPosition();
    }
  }

  // Handle table scroll to update menu position
  onTableScroll(event: Event) {
    if (this.showContextMenu && this.contextMenuCellElement) {
      this.updateContextMenuPosition();
    }
  }

  // Save cell details from modal
  saveCellDetails(modal: any) {
    console.log('Saving cell details:', this.selectedCellDetails);
    // Here you would save to API
    modal.close();
  }

  // Image upload handler
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.selectedCellDetails) {
          this.selectedCellDetails.imageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Initialize semen samples (sample data)
  initializeSemenSamples() {
    this.semenSamples = [
      {
        id: 'SEM001',
        sampleId: 'SP-2025-001',
        type: 'Fresh',
        collectionDate: new Date('2025-06-22T08:30:00'),
        volume: 3.5,
        concentration: 45,
        motility: 65,
        morphology: 12,
        notes: 'Normal parameters, good quality sample'
      },
      {
        id: 'SEM002',
        sampleId: 'SP-2025-002',
        type: 'Fresh',
        collectionDate: new Date('2025-06-22T09:15:00'),
        volume: 2.8,
        concentration: 38,
        motility: 58,
        morphology: 10,
        notes: 'Slightly lower concentration'
      },
      {
        id: 'SEM003',
        sampleId: 'SP-2025-003',
        type: 'Frozen',
        collectionDate: new Date('2025-05-15T10:00:00'),
        volume: 4.0,
        concentration: 52,
        motility: 72,
        morphology: 15,
        notes: 'Excellent quality frozen sample'
      },
      {
        id: 'SEM004',
        sampleId: 'SP-2025-004',
        type: 'Donor',
        collectionDate: new Date('2025-06-20T11:30:00'),
        volume: 3.2,
        concentration: 60,
        motility: 80,
        morphology: 18,
        notes: 'Donor sample - excellent parameters'
      }
    ];
  }

  // Open semen analysis modal
  openSemenModal(oocyte: Oocyte) {
    this.selectedOocyteForSemen = oocyte;
    this.selectedSemenSample = null;
    this.modalService.open(this.semenModal, { size: 'lg', centered: true });
  }

  // Select semen sample from list
  selectSemenSample(sample: SemenSample) {
    this.selectedSemenSample = sample;
  }

  // Assign selected semen sample to oocyte
  assignSemenSample(modal: any) {
    if (this.selectedSemenSample && this.selectedOocyteForSemen) {
      console.log('Assigning semen sample:', this.selectedSemenSample.sampleId, 'to oocyte:', this.selectedOocyteForSemen.id);
      // Here you would update the oocyte with the selected semen sample
      // For now, just close the modal
      modal.close();
    }
  }

  // Helper functions for SVG positions
  get8CellPositions() {
    // 8 cells arranged in a circular pattern within 36x36 viewBox
    return [
      { x: 13, y: 13 }, { x: 23, y: 13 },
      { x: 13, y: 23 }, { x: 23, y: 23 },
      { x: 18, y: 10 }, { x: 10, y: 18 },
      { x: 26, y: 18 }, { x: 18, y: 26 }
    ];
  }

  getMorulaPositions() {
    const positions = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 2 * Math.PI;
      const radius = 8 + Math.random() * 4;
      positions.push({
        x: 18 + radius * Math.cos(angle),
        y: 18 + radius * Math.sin(angle)
      });
    }
    return positions;
  }
}
