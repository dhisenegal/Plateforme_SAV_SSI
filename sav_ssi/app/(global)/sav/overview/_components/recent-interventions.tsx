import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function RecentInterventions() {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technicien
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">Olivia Martin</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">ABC Corp</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">01/10/2023</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">Jackson Lee</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">XYZ Inc</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">02/10/2023</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">Isabella Nguyen</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">DEF Ltd</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">03/10/2023</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">William Kim</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">GHI LLC</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">04/10/2023</p>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm font-medium text-gray-900">Sofia Davis</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">JKL Co</p>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <p className="text-sm text-gray-900">05/10/2023</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}