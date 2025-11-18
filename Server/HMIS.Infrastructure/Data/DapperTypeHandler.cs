using Dapper;
using System.Data;

namespace HMIS.Infrastructure.Data
{
    public static class DapperTypeHandlers
    {
        public static void RegisterTypeHandlers()
        {
            SqlMapper.RemoveTypeMap(typeof(TimeOnly));
            SqlMapper.RemoveTypeMap(typeof(TimeOnly?));
            SqlMapper.RemoveTypeMap(typeof(DateOnly));
            SqlMapper.RemoveTypeMap(typeof(DateOnly?));

            SqlMapper.AddTypeHandler(new TimeOnlyTypeHandler());
            SqlMapper.AddTypeHandler(new NullableTimeOnlyTypeHandler());
            SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());
            SqlMapper.AddTypeHandler(new NullableDateOnlyTypeHandler());
        }
    }

    public class TimeOnlyTypeHandler : SqlMapper.TypeHandler<TimeOnly>
    {
        public override void SetValue(IDbDataParameter parameter, TimeOnly value)
        {
            parameter.Value = value.ToString("HH:mm:ss");
        }

        public override TimeOnly Parse(object value)
        {
            if (value is TimeSpan timeSpan)
            {
                return TimeOnly.FromTimeSpan(timeSpan);
            }

            if (value is DateTime dateTime)
            {
                return TimeOnly.FromDateTime(dateTime);
            }

            if (value is string timeString)
            {
                if (TimeSpan.TryParse(timeString, out var ts))
                    return TimeOnly.FromTimeSpan(ts);
                if (TimeOnly.TryParse(timeString, out var to))
                    return to;
            }

            throw new InvalidCastException($"Unable to convert {value} to TimeOnly");
        }
    }

    public class NullableTimeOnlyTypeHandler : SqlMapper.TypeHandler<TimeOnly?>
    {
        public override void SetValue(IDbDataParameter parameter, TimeOnly? value)
        {
            parameter.Value = value?.ToString("HH:mm:ss");
        }

        public override TimeOnly? Parse(object value)
        {
            if (value == null || value == DBNull.Value)
                return null;

            if (value is TimeSpan timeSpan)
            {
                return TimeOnly.FromTimeSpan(timeSpan);
            }

            if (value is DateTime dateTime)
            {
                return TimeOnly.FromDateTime(dateTime);
            }

            if (value is string timeString)
            {
                if (TimeSpan.TryParse(timeString, out var ts))
                    return TimeOnly.FromTimeSpan(ts);
                if (TimeOnly.TryParse(timeString, out var to))
                    return to;
            }

            throw new InvalidCastException($"Unable to convert {value} to TimeOnly?");
        }
    }

    public class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
    {
        public override void SetValue(IDbDataParameter parameter, DateOnly value)
        {
            parameter.Value = value.ToString("yyyy-MM-dd");
        }

        public override DateOnly Parse(object value)
        {
            if (value is DateTime dateTime)
            {
                return DateOnly.FromDateTime(dateTime);
            }

            if (value is string dateString)
            {
                if (DateOnly.TryParse(dateString, out var dateOnly))
                    return dateOnly;
                if (DateTime.TryParse(dateString, out var dt))
                    return DateOnly.FromDateTime(dt);
            }

            throw new InvalidCastException($"Unable to convert {value} to DateOnly");
        }
    }

    public class NullableDateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly?>
    {
        public override void SetValue(IDbDataParameter parameter, DateOnly? value)
        {
            parameter.Value = value?.ToString("yyyy-MM-dd");
        }

        public override DateOnly? Parse(object value)
        {
            if (value == null || value == DBNull.Value)
                return null;

            if (value is DateTime dateTime)
            {
                return DateOnly.FromDateTime(dateTime);
            }

            if (value is string dateString)
            {
                if (DateOnly.TryParse(dateString, out var dateOnly))
                    return dateOnly;
                if (DateTime.TryParse(dateString, out var dt))
                    return DateOnly.FromDateTime(dt);
            }

            throw new InvalidCastException($"Unable to convert {value} to DateOnly?");
        }
    }
}