import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function RecentInterventions({ plans = [] }) { // Default to an empty array if plans is undefined
  console.log("Plans in RecentInterventions:", plans); // Log plans for debugging

  if (plans.length === 0) {
    return <p>Aucune intervention ou maintenance à venir</p>;
  }

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
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm font-medium text-gray-900">{plan.client}</p>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm text-gray-900">{plan.type}</p>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm text-gray-900">{plan.date}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}