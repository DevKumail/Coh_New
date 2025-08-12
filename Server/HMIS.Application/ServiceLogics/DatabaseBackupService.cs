using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SqlServer.Management.Smo;
using Microsoft.SqlServer.Management.Common;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace HMIS.Application.ServiceLogics
{
    public class DatabaseBackupService
    {
        string databaseName = "Ozone_19_02_2024";
        string backupFilePath = @"C:\D:\DatabaseBackup\Ozone.bak";

    

        public void BackupDatabase()
        {
            DateTime datetime =DateTime.Now;
            string date = datetime.ToString("dd");
            string month = datetime.ToString("MM");
            string year = datetime.ToString("yyyy");
            string hour = datetime.ToString("HH");
            string time = datetime.ToString("mm");
            string Und = "_";
            databaseName = "Ozone_19_02_2024";
            //backupFilePath = @"D:\DatabaseBackup\Ozone"+ datetime.ToString("mm") + ".bak";
            backupFilePath = @"D:\DatabaseBackup\" + databaseName +Und+date+Und+month+Und+year+Und+ hour +Und+ time + ".bak";
            ServerConnection serverConnection = new ServerConnection("DESKTOP-PE36NEL");
            Server sqlServer = new Server(serverConnection);

            // Create backup device
            Backup backup = new Backup();
            backup.Action = BackupActionType.Database;
            backup.Database = databaseName;
            backup.Devices.AddDevice(backupFilePath, DeviceType.File);

            // Perform backup
            backup.SqlBackup(sqlServer);
        }

    }
}
