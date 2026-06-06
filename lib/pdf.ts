import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function downloadStudentReport(student: any, reports: any[]) {
  const doc = new jsPDF() as any;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(6, 78, 59); // Madrasa Green
  doc.text('JAMIA NAQSHBANDIA BARVIA RIZVIA', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Student Academic Progress Report', 105, 30, { align: 'center' });

  // Student Info
  doc.setDrawColor(212, 175, 55); // Madrasa Gold
  doc.line(20, 35, 190, 35);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Student Name: ${student.name}`, 20, 45);
  doc.text(`ID: ${student.studentId}`, 150, 45);
  doc.text(`Father Name: ${student.fatherName}`, 20, 52);
  doc.text(`Admission Date: ${student.admissionDate}`, 150, 52);

  // Table
  const tableData = reports.map(r => [
    r.date,
    r.sabaq || '-',
    r.sabqi || '-',
    r.manzil || '-',
    r.namaz ? `${r.namaz}/5` : '0/5'
  ]);

  doc.autoTable({
    startY: 60,
    head: [['Date', 'Sabaq', 'Sabqi', 'Manzil', 'Namaz']],
    body: tableData,
    headStyles: { fillColor: [6, 78, 59], textColor: [212, 175, 55] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  doc.save(`${student.name}_Report.pdf`);
}

export function downloadFinanceReport(type: 'income' | 'expense', data: any[]) {
  const doc = new jsPDF() as any;

  doc.setFontSize(22);
  doc.setTextColor(6, 78, 59);
  doc.text('FINANCE LEDGER - ' + type.toUpperCase(), 105, 20, { align: 'center' });

  const tableData = data.map(d => [
    d.date,
    d.description,
    `Rs. ${d.amount.toLocaleString()}`,
    d.category || '-'
  ]);

  doc.autoTable({
    startY: 40,
    head: [['Date', 'Description', 'Amount', 'Category']],
    body: tableData,
    headStyles: { fillColor: [6, 78, 59] },
  });

  const total = data.reduce((acc, curr) => acc + curr.amount, 0);
  doc.setFontSize(14);
  doc.text(`Total ${type}: Rs. ${total.toLocaleString()}`, 20, doc.lastAutoTable.finalY + 15);

  doc.save(`${type}_Report.pdf`);
}
