/**
 * Utility functions for exporting data to various formats
 */

// Export data to CSV
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to JSON
export const exportToJSON = (data, filename = 'export') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export table to Excel (using CSV format, which Excel can open)
export const exportToExcel = (data, filename = 'export') => {
  exportToCSV(data, filename);
};

// Generate PDF content (basic HTML to PDF conversion)
export const generatePDFContent = (title, content, data = null) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #4F46E5;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 10px;
          }
          h2 {
            color: #6366F1;
            margin-top: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #4F46E5;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div>${content}</div>
        ${data ? generateTableHTML(data) : ''}
        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `;
  
  return htmlContent;
};

// Generate HTML table from data
const generateTableHTML = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

// Print current page or content
export const printContent = (title, content) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Share content via Web Share API or copy to clipboard
export const shareContent = async (title, text, url = window.location.href) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return { success: true, method: 'native' };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url}`);
    return { success: true, method: 'clipboard' };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, error };
  }
};

// Format currency for export
export const formatCurrencyForExport = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency
  }).format(amount);
};

// Format date for export
export const formatDateForExport = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Format datetime for export
export const formatDateTimeForExport = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  generatePDFContent,
  printContent,
  shareContent,
  formatCurrencyForExport,
  formatDateForExport,
  formatDateTimeForExport
};

