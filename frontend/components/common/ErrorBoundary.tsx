'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          background: '#18181b',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          minHeight: '240px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
            {this.props.fallbackTitle || 'Rendering Fallback'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#a1a1aa', maxWidth: '420px', lineHeight: 1.5 }}>
            {this.props.fallbackMessage || this.state.error?.message || 'A temporary visual component error occurred.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
