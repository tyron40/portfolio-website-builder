import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Portfolio, Page, Section, Component } from '../../types';

interface BuilderState {
  currentPortfolio: Portfolio | null;
  currentPageId: string | null;
  selectedComponentId: string | null;
  isDragging: boolean;
  history: Portfolio[];
  historyIndex: number;
}

const initialState: BuilderState = {
  currentPortfolio: null,
  currentPageId: null,
  selectedComponentId: null,
  isDragging: false,
  history: [],
  historyIndex: -1,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setCurrentPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state.currentPortfolio = action.payload;
      state.history = [action.payload];
      state.historyIndex = 0;
    },
    setCurrentPageId: (state, action: PayloadAction<string>) => {
      state.currentPageId = action.payload;
    },
    setSelectedComponentId: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    addPage: (state, action: PayloadAction<{ name: string; slug: string }>) => {
      if (!state.currentPortfolio) return;
      
      const newPage: Page = {
        id: uuidv4(),
        name: action.payload.name,
        slug: action.payload.slug,
        sections: [
          {
            id: uuidv4(),
            name: 'Main Section',
            components: [],
          },
        ],
      };
      
      state.currentPortfolio.pages.push(newPage);
      state.currentPageId = newPage.id;
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    updatePage: (state, action: PayloadAction<{ id: string; name: string; slug: string }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.id);
      if (pageIndex === -1) return;
      
      state.currentPortfolio.pages[pageIndex].name = action.payload.name;
      state.currentPortfolio.pages[pageIndex].slug = action.payload.slug;
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    deletePage: (state, action: PayloadAction<string>) => {
      if (!state.currentPortfolio) return;
      
      state.currentPortfolio.pages = state.currentPortfolio.pages.filter(page => page.id !== action.payload);
      
      if (state.currentPageId === action.payload) {
        state.currentPageId = state.currentPortfolio.pages[0]?.id || null;
      }
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    addSection: (state, action: PayloadAction<{ pageId: string; name: string }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      const newSection: Section = {
        id: uuidv4(),
        name: action.payload.name,
        components: [],
      };
      
      state.currentPortfolio.pages[pageIndex].sections.push(newSection);
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    updateSection: (state, action: PayloadAction<{ pageId: string; sectionId: string; name: string }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      const sectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
        section => section.id === action.payload.sectionId
      );
      if (sectionIndex === -1) return;
      
      state.currentPortfolio.pages[pageIndex].sections[sectionIndex].name = action.payload.name;
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    deleteSection: (state, action: PayloadAction<{ pageId: string; sectionId: string }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      state.currentPortfolio.pages[pageIndex].sections = state.currentPortfolio.pages[pageIndex].sections.filter(
        section => section.id !== action.payload.sectionId
      );
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    addComponent: (state, action: PayloadAction<{ pageId: string; sectionId: string; component: Omit<Component, 'id'> }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      const sectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
        section => section.id === action.payload.sectionId
      );
      if (sectionIndex === -1) return;
      
      const newComponent: Component = {
        id: uuidv4(),
        ...action.payload.component,
      };
      
      state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components.push(newComponent);
      state.selectedComponentId = newComponent.id;
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    updateComponent: (state, action: PayloadAction<{ pageId: string; sectionId: string; componentId: string; updates: Partial<Component> }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      const sectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
        section => section.id === action.payload.sectionId
      );
      if (sectionIndex === -1) return;
      
      const componentIndex = state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components.findIndex(
        component => component.id === action.payload.componentId
      );
      if (componentIndex === -1) return;
      
      state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components[componentIndex] = {
        ...state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components[componentIndex],
        ...action.payload.updates,
      };
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    deleteComponent: (state, action: PayloadAction<{ pageId: string; sectionId: string; componentId: string }>) => {
      if (!state.currentPortfolio) return;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === action.payload.pageId);
      if (pageIndex === -1) return;
      
      const sectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
        section => section.id === action.payload.sectionId
      );
      if (sectionIndex === -1) return;
      
      state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components = 
        state.currentPortfolio.pages[pageIndex].sections[sectionIndex].components.filter(
          component => component.id !== action.payload.componentId
        );
      
      if (state.selectedComponentId === action.payload.componentId) {
        state.selectedComponentId = null;
      }
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    moveComponent: (state, action: PayloadAction<{
      pageId: string;
      sourceSectionId: string;
      destinationSectionId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      if (!state.currentPortfolio) return;
      
      const { pageId, sourceSectionId, destinationSectionId, sourceIndex, destinationIndex } = action.payload;
      
      const pageIndex = state.currentPortfolio.pages.findIndex(page => page.id === pageId);
      if (pageIndex === -1) return;
      
      const sourceSectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
        section => section.id === sourceSectionId
      );
      if (sourceSectionIndex === -1) return;
      
      // If moving within the same section
      if (sourceSectionId === destinationSectionId) {
        const components = state.currentPortfolio.pages[pageIndex].sections[sourceSectionIndex].components;
        const [removed] = components.splice(sourceIndex, 1);
        components.splice(destinationIndex, 0, removed);
      } else {
        // Moving between different sections
        const destSectionIndex = state.currentPortfolio.pages[pageIndex].sections.findIndex(
          section => section.id === destinationSectionId
        );
        if (destSectionIndex === -1) return;
        
        const sourceComponents = state.currentPortfolio.pages[pageIndex].sections[sourceSectionIndex].components;
        const destComponents = state.currentPortfolio.pages[pageIndex].sections[destSectionIndex].components;
        
        const [removed] = sourceComponents.splice(sourceIndex, 1);
        destComponents.splice(destinationIndex, 0, removed);
      }
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.currentPortfolio = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.currentPortfolio = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
      }
    },
    updatePortfolioSettings: (state, action: PayloadAction<{ name: string; description?: string; theme: string }>) => {
      if (!state.currentPortfolio) return;
      
      state.currentPortfolio = {
        ...state.currentPortfolio,
        ...action.payload,
        updatedAt: Date.now(),
      };
      
      // Add to history
      state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.currentPortfolio))];
      state.historyIndex = state.history.length - 1;
    },
    publishPortfolio: (state, action: PayloadAction<{ published: boolean; publishedUrl?: string }>) => {
      if (!state.currentPortfolio) return;
      
      state.currentPortfolio = {
        ...state.currentPortfolio,
        published: action.payload.published,
        publishedUrl: action.payload.publishedUrl,
        updatedAt: Date.now(),
      };
    },
    resetBuilder: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentPortfolio,
  setCurrentPageId,
  setSelectedComponentId,
  setIsDragging,
  addPage,
  updatePage,
  deletePage,
  addSection,
  updateSection,
  deleteSection,
  addComponent,
  updateComponent,
  deleteComponent,
  moveComponent,
  undo,
  redo,
  updatePortfolioSettings,
  publishPortfolio,
  resetBuilder,
} = builderSlice.actions;

export default builderSlice.reducer;