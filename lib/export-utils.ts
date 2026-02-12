// Export utilities for converting data to CSV/Excel formats

export function convertToCSV(data: any[], headers: string[]): string {
    const csvRows = []

    // Add header row
    csvRows.push(headers.join(','))

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] ?? ''
            // Escape commas and quotes in values
            const escaped = String(value).replace(/"/g, '""')
            return `"${escaped}"`
        })
        csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
}

export function downloadCSV(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export async function exportAspirasiToCSV(aspirasi: any[]) {
    const headers = [
        'id',
        'title',
        'category',
        'content',
        'location',
        'status',
        'submitter_nama',
        'submitter_nis',
        'submitter_email',
        'submitter_kelas',
        'created_at',
        'updated_at'
    ]

    const formattedData = aspirasi.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        content: item.content,
        location: item.location || '-',
        status: item.status,
        submitter_nama: item.submitter?.nama || '-',
        submitter_nis: item.submitter?.nis || '-',
        submitter_email: item.submitter?.email || '-',
        submitter_kelas: item.submitter?.kelas || '-',
        created_at: new Date(item.created_at).toLocaleString('id-ID'),
        updated_at: new Date(item.updated_at).toLocaleString('id-ID')
    }))

    const csvContent = convertToCSV(formattedData, headers)
    const filename = `aspirasi-export-${new Date().toISOString().slice(0, 10)}.csv`

    downloadCSV(filename, csvContent)
}

// Excel export (using SheetJS would be ideal, but for now we'll use CSV)
export async function exportAspirasiToExcel(aspirasi: any[]) {
    // For now, we'll use CSV format
    // In production, you'd want to use a library like xlsx
    await exportAspirasiToCSV(aspirasi)
}
