using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFEpisodeTransferDto
    {
        public long? TransferId { get; set; }
        public int? IVFDashboardTreatmentCycleId { get; set; }
        public int? StatusId { get; set; }

        public IVFEpisodeTransferTransferDto? Transfer { get; set; }
        public List<IVFEpisodeTransferEmbryoDto>? EmbryosInTransfer { get; set; }
        public IVFEpisodeTransferFurtherInformationDto? FurtherInformation { get; set; }
    }

    public class IVFEpisodeTransferTransferDto
    {
        public long? Id { get; set; }
        public long? TransferId { get; set; }

        public DateTime? DateOfTransfer { get; set; }
        public TimeSpan? TimeOfTransfer { get; set; }
        public int? TransferDurationPerMin { get; set; }

        public long? ProviderId { get; set; }
        public long? NurseId { get; set; }

        public DateTime? DateOfSecTransfer { get; set; }
        public bool? ElectiveSingleEmbryoTransfer { get; set; }
        public long? EmbryologistId { get; set; }
    }

    public class IVFEpisodeTransferFurtherInformationDto
    {
        public int? CultureDays { get; set; }
        public long? CathererCategoryId { get; set; }
        public string? CathererAddition { get; set; }

        public long? MainCompilationCategoryId { get; set; }
        public long? FurtherComplicationCategoryId { get; set; }

        public bool? SeveralAttempts { get; set; }
        public int? NoOfAttempts { get; set; }
        public bool? EmbryoGlue { get; set; }
        public bool? DifficultCathererInsertion { get; set; }
        public bool? CatheterChange { get; set; }
        public bool? MucusInCatheter { get; set; }
        public bool? BloodInCatheter { get; set; }
        public bool? Dilation { get; set; }
        public bool? UltrasoundCheck { get; set; }
        public bool? Vulsellum { get; set; }
        public bool? Probe { get; set; }

        public string? Note { get; set; }
    }

    public class IVFEpisodeTransferEmbryoDto
    {
        public long? EmbryoInTransferId { get; set; }
        public long? TransferId { get; set; }

        public long? SequenceId { get; set; }
        public long? EmbryoId { get; set; }
        public string? CellInformation { get; set; }
        public bool? Ideal { get; set; }
        public long? ScoreCategoryId { get; set; }
    }

    public class IVFEpisodeTransferListItemDto
    {
        public long TransferId { get; set; }
        public int IVFDashboardTreatmentCycleId { get; set; }
        public DateTime? DateOfTransfer { get; set; }
        public int? CultureDays { get; set; }
        public int? TransferDurationPerMin { get; set; }
    }
}
