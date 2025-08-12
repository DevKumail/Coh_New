using HMIS.Core.Entities;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Data.Validations
{
    [AttributeUsage(AttributeTargets.Class)]
    public class AtLeastOneDaySelectedAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var instance = validationContext.ObjectInstance as ProviderSchedule;

            if (instance != null)
            {
                var daysSelected = new List<bool?>
                {
                    instance.Sunday,
                    instance.Monday,
                    instance.Tuesday,
                    instance.Wednesday,
                    instance.Thursday,
                    instance.Friday,
                    instance.Saturday
                };

                if (daysSelected.Any(day => day == true))
                {
                    return ValidationResult.Success;
                }
            }

            return new ValidationResult("At least one day must be selected.");
        }
    }
}
