using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.SpLocalModel
{
    public class UserListModel
    {
        public int? facilityId { get; set; }
        public int? employeeType { get; set; }
        public string? genderId { get; set; }
        public string? name { get; set; }
        public string? email { get; set; }
        public string? cellNo { get; set; }
        public string? joiningDate { get; set; }
        public string? active { get; set; }
        public class FilterUserList
        {
            public UserListModel? UserList { get; set; }
            public PaginationInfo? PaginationInfo { get; set; }
        }
    }
}