import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function RecentInterventions() {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">SONATEL</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">INTERVENTION</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">01/01/2025</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">SENELEC</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">MAINTENANCE</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">02/01/2025</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">DER</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">INTERVENTION</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">03/01/2025</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">SONATEL</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">MAINTENANCE</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">03/01/2025</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">SENELEC</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">MAINTENANCE</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">05/01/2025</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}