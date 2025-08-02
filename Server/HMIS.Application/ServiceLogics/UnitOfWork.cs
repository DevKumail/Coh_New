////using COI.Application.Interfaces;

//using HMIS.Data.Models;
//using Microsoft.EntityFrameworkCore.Storage;

//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;


//namespace HMIS.Service
//{
//    public class UnitOfWork : IUnitOfWork
//    {
//        private HIMSDBContext _context;
//        public UnitOfWork(
//            HIMSDBContext context
//            )
//        {
//            _context = context;
//        }
//        //public int SaveChanges()
//        //{
//        //    return _context.SaveChanges();
//        //}

//        //public async Task<int> SaveChangesCheckerApprovalAsync()
//        //{
//        //    return await _context.SaveChangesCheckerApprovalAsync();
//        //}
//        public async Task<int> SaveChangesAsync()
//        {
//            return await _context.SaveChangesAsync();
//        }

//        public void Dispose()
//        {
//            _context.Dispose();
//        }

//        public IDbContextTransaction BeginTransaction()
//        {
//            return _context.Database.BeginTransaction();
//        }
//        public async Task<IDbContextTransaction> BeginTransactionAsync()
//        {
//            return await _context.Database.BeginTransactionAsync();
//        }

//        public Task<int> SaveChangesCheckerApprovalAsync()
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
