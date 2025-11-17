using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Core.Context;

namespace HMIS.Application.ServiceLogics.IVF
{
    public interface IIVFLabService
    {
        Task<LabTestTreeResponseDTO> GetLabTestTree(int? investigationTypeId, int? laboratoryId);
    }

    public class IVFLabService : IIVFLabService
    {
        private readonly HMISDbContext _db;
        public IVFLabService(HMISDbContext db)
        {
            _db = db;
        }
        public async Task<LabTestTreeResponseDTO> GetLabTestTree(int? investigationTypeId, int? laboratoryId)
        {
            // Load all active/visible rows via EF; prune by filters in memory to preserve parent categories
            var list = _db.LabTests
                .Where(x => (x.Active ?? true) && !(x.IsDeleted ?? false) && !(x.IsHidden ?? false))
                .Select(x => new LabRow
                {
                    LabTestId = x.LabTestId,
                    ParentId = x.ParentId,
                    LabName = x.LabName,
                    CPTCode = x.Cptcode,
                    IsProfile = x.IsProfile,
                    InvestigationTypeID = x.InvestigationTypeId,
                    LaboratoryId = x.LaboratoryId,
                    SampleTypeId = x.SampleTypeId,
                    SampleTypeName = x.SampleType != null ? x.SampleType.SampleName : string.Empty
                })
                .ToList();
            if (list.Count == 0)
            {
                return new LabTestTreeResponseDTO { Disabled = true, Data = new List<LabTestTreeNodeDTO>() };
            }

            // Build nodes dictionary first
            var nodes = new Dictionary<long, LabTestTreeNodeDTO>();
            foreach (var r in list)
            {
                nodes[r.LabTestId] = new LabTestTreeNodeDTO
                {
                    Id = r.LabTestId,
                    ParentId = r.ParentId,
                    Label = r.LabName ?? string.Empty,
                    CptCode = r.CPTCode,
                    IsProfile = r.IsProfile ?? false,
                    SampleTypeId = r.SampleTypeId,
                    SampleTypeName = r.SampleTypeName ?? string.Empty,
                    Children = new List<LabTestTreeNodeDTO>()
                };
            }

            var roots = new List<LabTestTreeNodeDTO>();
            foreach (var n in nodes.Values)
            {
                if (n.ParentId.HasValue && nodes.ContainsKey(n.ParentId.Value))
                {
                    nodes[n.ParentId.Value].Children.Add(n);
                }
                else
                {
                    roots.Add(n);
                }
            }

            // Helper to determine if a node or any descendant matches filters
            bool NodeMatchesFilter(LabRow r)
            {
                bool invMatch = !investigationTypeId.HasValue || r.InvestigationTypeID == investigationTypeId;
                bool labMatch = !laboratoryId.HasValue || r.LaboratoryId == laboratoryId;
                return invMatch && labMatch;
            }

            var rowsById = list.ToDictionary(x => x.LabTestId, x => x);

            bool PruneNonMatching(LabTestTreeNodeDTO node)
            {
                // prune children first
                for (int i = node.Children.Count - 1; i >= 0; i--)
                {
                    if (!PruneNonMatching(node.Children[i]))
                    {
                        node.Children.RemoveAt(i);
                    }
                }
                // self match if present in rows
                var selfRow = rowsById.TryGetValue(node.Id, out var row) ? row : null;
                bool selfMatches = selfRow != null && NodeMatchesFilter(selfRow);
                // keep node if it matches itself or has any remaining children
                bool keep = selfMatches || node.Children.Count > 0 || (!investigationTypeId.HasValue && !laboratoryId.HasValue);

                // Set category/selectable flags
                bool hasChildren = node.Children.Count > 0;
                bool isCategoryByAttr = string.IsNullOrEmpty(node.CptCode) || (selfRow?.IsProfile ?? false);
                node.IsCategory = hasChildren || isCategoryByAttr;
                node.Selectable = !node.IsCategory && !string.IsNullOrEmpty(node.Label);

                return keep;
            }

            for (int i = roots.Count - 1; i >= 0; i--)
            {
                if (!PruneNonMatching(roots[i]))
                {
                    roots.RemoveAt(i);
                }
            }

            if (roots.Count == 0)
            {
                return new LabTestTreeResponseDTO { Disabled = true, Data = new List<LabTestTreeNodeDTO>() };
            }

            return new LabTestTreeResponseDTO { Disabled = false, Data = roots };
        }

        private class LabRow
        {
            public long LabTestId { get; set; }
            public long? ParentId { get; set; }
            public string LabName { get; set; }
            public string CPTCode { get; set; }
            public bool? IsProfile { get; set; }
            public int? InvestigationTypeID { get; set; }
            public int? LaboratoryId { get; set; }
            public int? SampleTypeId { get; set; }
            public string SampleTypeName { get; set; }
        }
    }
}
